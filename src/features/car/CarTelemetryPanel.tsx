import { useMemo } from "react";

import carImage from "@/assets/f1-car.png";

import { Panel } from "@/components/panel/Panel";
import { useSimulationStore } from "@/state/simulation.store";
import { useUIStore } from "@/state/ui.store";

type TyreId = "fl" | "fr" | "rl" | "rr";

const tyreLabels: Record<TyreId, string> = {
  fl: "FL",
  fr: "FR",
  rl: "RL",
  rr: "RR",
};

const tyrePositions: Record<
  TyreId,
  string
> = {
  fl: "left-[20%] top-[21%]",
  fr: "right-[20%] top-[21%]",
  rl: "left-[20%] bottom-[21%]",
  rr: "right-[20%] bottom-[21%]",
};

function getTemperatureClass(temp: number) {
  if (temp >= 112) {
    return "border-[var(--critical)] bg-[rgba(255,93,93,0.16)]";
  }

  if (temp >= 105) {
    return "border-[var(--warning)] bg-[rgba(255,200,87,0.14)]";
  }

  return "border-[var(--success)] bg-[rgba(112,225,138,0.1)]";
}

export function CarTelemetryPanel() {
  const selectedDriverId =
    useUIStore((state) => state.selectedDriverId);

  const focusedTyre =
    useUIStore((state) => state.focusedTyre);

  const focusTyre =
    useUIStore((state) => state.focusTyre);

  const driver = useSimulationStore(
    (state) => state.state.drivers[selectedDriverId],
  );

  const tyres = driver?.tyres;

  const tyreCards = useMemo(() => {
    if (!tyres) {
      return [];
    }

    return (
      Object.entries(tyres) as [
        TyreId,
        (typeof tyres)[TyreId],
      ][]
    ).map(([id, tyre]) => ({
      id,
      ...tyre,
    }));
  }, [tyres]);

  if (!driver || !tyres) {
    return null;
  }

  return (
    <Panel
      eyebrow="CAR SYSTEMS"
      title="Tyre Telemetry"
      action={
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {driver.shortName}
        </span>
      }
    >
      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(280px,0.95fr)_minmax(280px,1.05fr)]">
        {/* Car visualization */}
        <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] blur-[90px]" />
          </div>

          <img
            src={carImage}
            alt="Apex Racing Formula 1 car"
            className="relative z-10 h-auto w-[58%] max-w-[300px] select-none object-contain"
          />

          {tyreCards.map((tyre) => {
            const selected =
              focusedTyre === tyre.id;

            return (
              <button
                key={tyre.id}
                type="button"
                aria-label={`Focus ${tyreLabels[tyre.id]} tyre`}
                aria-pressed={selected}
                onClick={() =>
                  focusTyre(
                    selected ? null : tyre.id,
                  )
                }
                className={[
                  "absolute z-20 flex h-14 w-11",
                  "items-center justify-center",
                  "rounded-md border-2",
                  "transition-all duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[var(--accent)]",
                  tyrePositions[tyre.id],
                  getTemperatureClass(tyre.tempC),
                  selected
                    ? "scale-110 shadow-[0_0_24px_rgba(216,255,62,0.3)]"
                    : "hover:scale-105",
                ].join(" ")}
              >
                <span className="font-mono text-[9px] font-bold text-[var(--text-primary)]">
                  {tyreLabels[tyre.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tyre telemetry */}
        <div className="grid grid-cols-2 gap-3">
          {tyreCards.map((tyre) => {
            const selected =
              focusedTyre === tyre.id;

            return (
              <button
                key={tyre.id}
                type="button"
                onClick={() =>
                  focusTyre(
                    selected ? null : tyre.id,
                  )
                }
                className={[
                  "rounded-lg border p-4 text-left",
                  "transition-all duration-200",
                  "hover:bg-[var(--surface-hover)]",
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-2)]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.14em] text-[var(--text-primary)]">
                    {tyreLabels[tyre.id]}
                  </span>

                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      tyre.tempC >= 112
                        ? "bg-[var(--critical)]"
                        : tyre.tempC >= 105
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--success)]",
                    ].join(" ")}
                  />
                </div>

                <div className="mt-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Temperature
                  </div>

                  <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
                    {Math.round(tyre.tempC)}
                    <span className="ml-1 text-xs text-[var(--text-muted)]">
                      °C
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Pressure
                  </div>

                  <div className="mt-1 font-mono text-lg font-medium tabular-nums text-[var(--text-primary)]">
                    {tyre.pressureBar.toFixed(2)}
                    <span className="ml-1 text-xs text-[var(--text-muted)]">
                      bar
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}