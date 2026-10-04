import type { DriverState } from "@/features/driver/driver.types";

import { useUIStore } from "@/state/ui.store";

interface VehicleTelemetryPanelProps {
  driver: DriverState;
}

interface TyreCardProps {
  tyre: "fl" | "fr" | "rl" | "rr";
  label: string;
  tempC: number;
  pressureBar: number;
}

function TyreCard({
  tyre,
  label,
  tempC,
  pressureBar,
}: TyreCardProps) {
  const focusedTyre = useUIStore(
    (store) => store.focusedTyre,
  );

  const focusTyre = useUIStore(
    (store) => store.focusTyre,
  );

  const isFocused = focusedTyre === tyre;

  return (
    <div
        onClick={() =>
            focusTyre(isFocused ? null : tyre)
        }
        className={`cursor-pointer rounded-lg border p-3 transition ${
            isFocused
            ? "border-[var(--accent)] bg-[var(--surface-3)]"
            : "border-[var(--border)] bg-[var(--surface-2)]"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {label}
        </span>

        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
      </div>

      <div className="mt-3">
        <div className="text-lg font-bold text-[var(--text-primary)]">
          {tempC.toFixed(1)}°C
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Temperature
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-semibold text-[var(--text-primary)]">
          {pressureBar.toFixed(2)} bar
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Pressure
        </div>
      </div>
    </div>
  );
}

export function VehicleTelemetryPanel({
  driver,
}: VehicleTelemetryPanelProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Vehicle Telemetry
          </div>

          <div className="mt-1 text-lg font-bold text-[var(--text-primary)]">
            {driver.shortName}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Car
          </div>

          <div className="text-sm font-bold text-[var(--text-primary)]">
            #{driver.number}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <TyreCard
        tyre="fl"
        label="FL"
        tempC={driver.tyres.fl.tempC}
        pressureBar={driver.tyres.fl.pressureBar}
        />

        <TyreCard
        tyre="fr"
        label="FR"
        tempC={driver.tyres.fr.tempC}
        pressureBar={driver.tyres.fr.pressureBar}
        />

        <TyreCard
        tyre="rl"
        label="RL"
        tempC={driver.tyres.rl.tempC}
        pressureBar={driver.tyres.rl.pressureBar}
        />

        <TyreCard
        tyre="rr"
        label="RR"
        tempC={driver.tyres.rr.tempC}
        pressureBar={driver.tyres.rr.pressureBar}
        />
      </div>
    </section>
  );
}