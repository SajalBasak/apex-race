import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import carArt from "@/assets/f1-car.png";
import trackSvg from "@/assets/track-hockenheim.svg?raw";

import type { DriverState } from "@/features/driver/driver.types";
import { useUIStore } from "@/state/ui.store";

interface TrackMapProps {
  drivers: DriverState[];
}

interface TrackGeometry {
  viewBox: string;
  innerHtml: string;
}

interface TrackPosition {
  x: number;
  y: number;
  rotation: number;
}

const DRIVER_COLORS: Record<string, string> = {
  "nova-07": "var(--accent)",
  "veldor-18": "var(--status-info)",
  "hale-31": "var(--status-warning)",
};

const FALLBACK_COLOR = "var(--accent)";

/**
 * Parse only the outer SVG metadata/content.
 *
 * The actual supplied track artwork remains untouched.
 */
function parseTrackSvg(svg: string): TrackGeometry {
  const document = new DOMParser().parseFromString(
    svg,
    "image/svg+xml",
  );

  const root = document.documentElement;

  return {
    viewBox:
      root.getAttribute("viewBox") ??
      "0 0 1000 700",

    innerHtml: root.innerHTML,
  };
}

/**
 * Smoothly interpolate around a closed track.
 *
 * Example:
 *   0.99 -> 0.01
 *
 * should move forward through the start/finish line,
 * not backwards around almost the entire circuit.
 */
function interpolateProgress(
  from: number,
  to: number,
  amount: number,
): number {
  let delta = to - from;

  if (delta > 0.5) {
    delta -= 1;
  }

  if (delta < -0.5) {
    delta += 1;
  }

  return (from + delta * amount + 1) % 1;
}

function getPathPoint(
  path: SVGPathElement,
  progress: number,
): TrackPosition {
  const totalLength = path.getTotalLength();

  if (totalLength <= 0) {
    return {
      x: 0,
      y: 0,
      rotation: 0,
    };
  }

  const normalized =
    ((progress % 1) + 1) % 1;

  const length =
    normalized * totalLength;

  const lookAhead = Math.min(
    Math.max(totalLength * 0.0025, 2),
    12,
  );

  const current =
    path.getPointAtLength(length);

  const ahead =
    path.getPointAtLength(
      (length + lookAhead) % totalLength,
    );

  const rotation =
    (Math.atan2(
      ahead.y - current.y,
      ahead.x - current.x,
    ) *
      180) /
      Math.PI +
    90;

  return {
    x: current.x,
    y: current.y,
    rotation,
  };
}

function findRacingLine(
  svg: SVGSVGElement,
): SVGPathElement | null {
  const explicitPath =
    svg.querySelector<SVGPathElement>(
      "[data-racing-line='true']",
    );

  if (explicitPath) {
    return explicitPath;
  }

  const paths =
    Array.from(
      svg.querySelectorAll<SVGPathElement>(
        "path",
      ),
    );

  if (paths.length === 0) {
    return null;
  }

  /*
   * The supplied SVG may contain several visual
   * layers such as glow/stroke duplicates.
   *
   * Prefer the longest path when no explicit
   * racing-line marker exists.
   */
  let longestPath = paths[0];
  let longestLength = 0;

  for (const path of paths) {
    const length =
      path.getTotalLength();

    if (length > longestLength) {
      longestLength = length;
      longestPath = path;
    }
  }

  return longestPath;
}

export function TrackMap({
  drivers,
}: TrackMapProps) {
  const selectedDriverId =
    useUIStore(
      (state) => state.selectedDriverId,
    );

  const selectDriver =
    useUIStore(
      (state) => state.selectDriver,
    );

  const svgRef =
    useRef<SVGSVGElement | null>(null);

  const pathRef =
    useRef<SVGPathElement | null>(null);

  const geometry = useMemo(
    () => parseTrackSvg(trackSvg),
    [],
  );

  const targetProgressRef =
    useRef<Record<string, number>>({});

  const currentProgressRef =
    useRef<Record<string, number>>({});

  const transitionRef =
    useRef<{
      startedAt: number;
      from: Record<string, number>;
      to: Record<string, number>;
    }>({
      startedAt: 0,
      from: {},
      to: {},
    });

  const [animatedProgress, setAnimatedProgress] =
    useState<Record<string, number>>({});

  const driverProgress = useMemo(
    () =>
      Object.fromEntries(
        drivers.map((driver) => [
          driver.id,
          driver.race.lapProgress,
        ]),
      ),
    [drivers],
  );

  /*
   * Update interpolation targets whenever the
   * simulation produces a new race position.
   */
  useEffect(() => {
    const now =
      performance.now();

    const from: Record<
      string,
      number
    > = {};

    for (const driver of drivers) {
      from[driver.id] =
        currentProgressRef.current[
          driver.id
        ] ??
        driver.race.lapProgress;
    }

    targetProgressRef.current =
      driverProgress;

    transitionRef.current = {
      startedAt: now,
      from,
      to: driverProgress,
    };
  }, [driverProgress, drivers]);

  /*
   * One animation loop interpolates between
   * simulation snapshots.
   *
   * The simulation can continue ticking once
   * per second while visual movement stays smooth.
   */
  useEffect(() => {
    let frameId = 0;

    const animate = (
      now: number,
    ) => {
      const transition =
        transitionRef.current;

      const elapsed =
        now - transition.startedAt;

      const duration = 900;

      const raw =
        Math.min(
          elapsed / duration,
          1,
        );

      /*
       * Ease-out interpolation.
       */
      const amount =
        1 -
        Math.pow(
          1 - raw,
          3,
        );

      const next: Record<
        string,
        number
      > = {};

      for (const driver of drivers) {
        const from =
          transition.from[
            driver.id
          ] ??
          driver.race.lapProgress;

        const to =
          transition.to[
            driver.id
          ] ??
          driver.race.lapProgress;

        next[driver.id] =
          interpolateProgress(
            from,
            to,
            amount,
          );
      }

      currentProgressRef.current =
        next;

      setAnimatedProgress(next);

      frameId =
        requestAnimationFrame(
          animate,
        );
    };

    frameId =
      requestAnimationFrame(
        animate,
      );

    return () =>
      cancelAnimationFrame(
        frameId,
      );
  }, [drivers]);

  /*
   * Find the actual racing line once the
   * supplied SVG is mounted.
   */
  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    pathRef.current =
      findRacingLine(
        svgRef.current,
      );
  }, [geometry.innerHtml]);

  const positions = useMemo(() => {
    const path =
      pathRef.current;

    if (!path) {
      return {};
    }

    return Object.fromEntries(
      drivers.map((driver) => [
        driver.id,
        getPathPoint(
          path,
          animatedProgress[
            driver.id
          ] ??
            driver.race.lapProgress,
        ),
      ]),
    );
  }, [
    animatedProgress,
    drivers,
  ]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,255,62,0.045),transparent_68%)]" />

      <svg
        ref={svgRef}
        viewBox={geometry.viewBox}
        className="block h-auto w-full"
        role="img"
        aria-label="Live Hockenheim track map"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          dangerouslySetInnerHTML={{
            __html:
              geometry.innerHtml,
          }}
        />

        {drivers.map((driver) => {
          const position =
            positions[driver.id];

          if (!position) {
            return null;
          }

          const isSelected =
            driver.id ===
            selectedDriverId;

          const markerColor =
            DRIVER_COLORS[
              driver.id
            ] ??
            FALLBACK_COLOR;

          return (
            <g
              key={driver.id}
              transform={`translate(${position.x} ${position.y})`}
              onClick={() =>
                selectDriver(
                  driver.id,
                )
              }
              role="button"
              tabIndex={0}
              aria-label={`Select ${driver.name}`}
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {
                  event.preventDefault();

                  selectDriver(
                    driver.id,
                  );
                }
              }}
              className="cursor-pointer"
            >
              {isSelected && (
                <circle
                  r="13"
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="1.5"
                  opacity="0.85"
                >
                  <animate
                    attributeName="r"
                    values="10;15;10"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />

                  <animate
                    attributeName="opacity"
                    values="0.9;0.15;0.9"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              <circle
                r="8"
                fill="var(--surface-1)"
                stroke={markerColor}
                strokeWidth={
                  isSelected ? 2.5 : 1.5
                }
              />

              <image
                href={carArt}
                x="-7"
                y="-14"
                width="14"
                height="28"
                preserveAspectRatio="xMidYMid meet"
                transform={`rotate(${position.rotation})`}
              />

              <text
                x="0"
                y="0"
                dy="0.35em"
                textAnchor="middle"
                fontSize="6"
                fontWeight="800"
                fill="var(--background)"
                className="pointer-events-none select-none"
              >
                {driver.number}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute left-3 top-3">
        <div className="rounded border border-[var(--border)] bg-[var(--surface-1)]/90 px-2 py-1 backdrop-blur-sm">
          <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            LIVE TRACK
          </div>

          <div className="mt-0.5 text-[11px] font-semibold text-[var(--text-primary)]">
            Hockenheimring
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded border border-[var(--border)] bg-[var(--surface-1)]/90 px-2 py-1.5 backdrop-blur-sm">
        {drivers.map((driver) => (
          <button
            key={driver.id}
            type="button"
            onClick={() =>
              selectDriver(
                driver.id,
              )
            }
            className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.08em]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  DRIVER_COLORS[
                    driver.id
                  ] ??
                  FALLBACK_COLOR,
              }}
            />

            <span
              className={
                driver.id ===
                selectedDriverId
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              }
            >
              {driver.shortName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}