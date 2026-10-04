import { useEffect } from "react";

import { AppShell } from "@/app/AppShell";
import { Metric } from "@/components/metric/Metric";
import { Panel } from "@/components/panel/Panel";
import { StatusBadge } from "@/components/status/StatusBadge";

import { CarTelemetryPanel } from "@/features/car/CarTelemetryPanel";

import { useSimulationStore } from "@/state/simulation.store";
import { useUIStore } from "@/state/ui.store";

import {
  startSimulation,
  stopSimulation,
} from "@/simulation/simulation.runner";

function App() {
  useEffect(() => {
    startSimulation();

    return () => {
      stopSimulation();
    };
  }, []);

  const simulation = useSimulationStore(
    (store) => store.state,
  );

  const selectedDriverId = useUIStore(
    (store) => store.selectedDriverId,
  );

  const selectDriver = useUIStore(
    (store) => store.selectDriver,
  );

  const selectedDriver =
    simulation.drivers[selectedDriverId];

  const selectedCar =
    simulation.carTelemetry[selectedDriverId];

  if (!selectedDriver || !selectedCar) {
    return null;
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-4 lg:px-6 lg:py-6">

        {/* Header */}
        <header className="mb-5 flex flex-col gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <StatusBadge status="live">
                Live
              </StatusBadge>

              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                T+
                {" "}
                {Math.floor(
                  simulation.elapsedMs / 1000,
                )}
                s
              </span>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              Race Control
            </h1>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {simulation.circuit.name} ·{" "}
              {simulation.circuit.country}
            </p>
          </div>

          {/* Driver selector */}
          <div className="flex flex-wrap gap-2">
            {Object.values(simulation.drivers).map(
              (driver) => {
                const selected =
                  driver.id === selectedDriverId;

                return (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() =>
                      selectDriver(driver.id)
                    }
                    className={[
                      "rounded-[var(--radius-control)]",
                      "border px-3 py-2",
                      "text-[10px] font-bold",
                      "uppercase tracking-[0.12em]",
                      "transition-colors",
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    {driver.shortName}
                  </button>
                );
              },
            )}
          </div>
        </header>


        {/* RACE STATUS */}
        <Panel
          eyebrow="RACE STATUS"
          title={selectedDriver.shortName}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-4 sm:grid-cols-4">
            <Metric
              label="Position"
              value={`P${selectedDriver.race.position}`}
              accent
            />

            <Metric
              label="Lap"
              value={`${selectedDriver.race.lap}/${selectedDriver.race.totalLaps}`}
            />

            <Metric
              label="Top Speed"
              value={selectedDriver.race.topSpeedKmh}
              unit="km/h"
            />

            <Metric
              label="Best Lap"
              value={selectedDriver.race.bestLap}
            />
          </div>

          {/* Lap progress */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Lap Progress
              </span>

              <span className="font-mono text-[10px] tabular-nums text-[var(--text-secondary)]">
                {Math.round(
                  selectedDriver.race.lapProgress * 100,
                )}
                %
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700"
                style={{
                  width: `${
                    selectedDriver.race.lapProgress *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </Panel>


        {/* MAIN TELEMETRY Car / Tyres + Driver physiology */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Interactive car + four tyres */}
          <CarTelemetryPanel />

          {/* Driver telemetry */}
          <Panel
            eyebrow="DRIVER TELEMETRY"
            title={selectedDriver.shortName}
          >
            <div className="grid grid-cols-2 gap-3 p-4">

              {/* Heart rate */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Heart Rate
                </div>

                <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
                  {selectedDriver.physiology.heartRateBpm}
                  <span className="ml-1 text-xs text-[var(--text-muted)]">
                    bpm
                  </span>
                </div>
              </div>

              {/* Breathing */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Breathing
                </div>

                <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
                  {selectedDriver.physiology.breathsPerMin.toFixed(
                    1,
                  )}
                  <span className="ml-1 text-xs text-[var(--text-muted)]">
                    /min
                  </span>
                </div>
              </div>

              {/* Stress */}
              <div className="col-span-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Stress
                  </div>

                  <span className="font-mono text-sm tabular-nums text-[var(--text-primary)]">
                    {selectedDriver.physiology.stress}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
                  <div
                    className="h-full rounded-full bg-[var(--warning)] transition-[width] duration-700"
                    style={{
                      width: `${selectedDriver.physiology.stress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current lap */}
              <div className="col-span-2 mt-1 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Current Lap
                </span>

                <span className="font-mono text-lg font-semibold tabular-nums text-[var(--accent)]">
                  {selectedDriver.race.currentLapTime}
                </span>
              </div>
            </div>
          </Panel>
        </div>


        {/* CAR / POWER UNIT TELEMETRY */}
        <div className="mt-5">
          <Panel
            eyebrow="POWER UNIT"
            title="Car Telemetry"
          >
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">

              <Metric
                label="RPM"
                value={selectedCar.rpm}
              />

              <Metric
                label="Engine Temp"
                value={selectedCar.engineTempC}
                unit="°C"
              />

              <Metric
                label="Fuel"
                value={selectedCar.fuelPercent.toFixed(1)}
                unit="%"
              />

              <Metric
                label="ERS"
                value={selectedCar.ersPercent.toFixed(1)}
                unit="%"
                accent
              />

            </div>
          </Panel>
        </div>


        {/* PLACEHOLDER FOR NEXT VERTICAL SLICES */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

          {/* Track map */}
          <Panel
            eyebrow="CIRCUIT"
            title={`${simulation.circuit.name} Track Map`}
          >
            <div className="flex min-h-[280px] items-center justify-center p-6">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Track map
                </div>

                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  Interactive circuit visualization
                  coming next
                </div>
              </div>
            </div>
          </Panel>

          {/* Weather */}
          <Panel
            eyebrow="TRACK CONDITIONS"
            title="Weather"
          >
            <div className="grid grid-cols-2 gap-4 p-4">

              <Metric
                label="Air Temp"
                value={simulation.weather.airTempC.toFixed(
                  1,
                )}
                unit="°C"
              />

              <Metric
                label="Humidity"
                value={simulation.weather.humidityPercent.toFixed(
                  0,
                )}
                unit="%"
              />

              <Metric
                label="Wind"
                value={simulation.weather.windSpeedKmh.toFixed(
                  1,
                )}
                unit="km/h"
              />

              <Metric
                label="Pressure"
                value={simulation.weather.pressureMb.toFixed(
                  0,
                )}
                unit="mb"
              />
            </div>

            <div className="border-t border-[var(--border)] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Cloud Cover
                </span>

                <span className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                  {simulation.weather.cloudCoverPercent.toFixed(
                    0,
                  )}
                  %
                </span>
              </div>
            </div>
          </Panel>
        </div>


        {/* LIVE EVENTS */}
        <div className="mt-5">
          <Panel
            eyebrow="RACE CONTROL"
            title="Live Event Stream"
          >
            <div className="divide-y divide-[var(--border)]">
              {simulation.events
                .slice(0, 6)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        event.severity ===
                          "critical"
                          ? "bg-[var(--critical)]"
                          : event.severity ===
                              "caution"
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--info)]",
                      ].join(" ")}
                    />

                    <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                      {event.message}
                    </span>

                    <span className="shrink-0 font-mono text-[9px] tabular-nums text-[var(--text-muted)]">
                      {new Date(
                        event.timestamp,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </Panel>
        </div>

      </main>
    </AppShell>
  );
}

export default App;