import { Panel } from "@/components/panel/Panel";
import { useSimulationStore } from "@/state/simulation.store";
import { useUIStore } from "@/state/ui.store";

import { TelemetryChart } from "./TelemetryChart";

export function DriverTelemetryPanel() {
  const selectedDriverId = useUIStore(
    (state) => state.selectedDriverId,
  );

  const driver = useSimulationStore(
    (state) =>
      state.state.drivers[selectedDriverId],
  );

  const history = useSimulationStore(
    (state) =>
      state.state.telemetryHistory[
        selectedDriverId
      ] ?? [],
  );

  if (!driver) {
    return null;
  }

  return (
    <Panel
      eyebrow="DRIVER TELEMETRY"
      title={driver.shortName}
      action={
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
          LIVE · 60S
        </span>
      }
    >
      <div className="grid gap-3 p-4">
        <TelemetryChart
          title="Heart Rate"
          unit="bpm"
          data={history}
          dataKey="heartRateBpm"
          stroke="var(--accent)"
          domain={[55, 180]}
        />

        <TelemetryChart
          title="Breathing"
          unit="/min"
          data={history}
          dataKey="breathsPerMin"
          stroke="var(--info)"
          domain={[8, 35]}
          decimals={1}
        />

        <TelemetryChart
          title="Stress"
          unit="%"
          data={history}
          dataKey="stress"
          stroke="var(--warning)"
          domain={[0, 100]}
        />
      </div>
    </Panel>
  );
}