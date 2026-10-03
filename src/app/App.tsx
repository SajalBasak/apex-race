import { useEffect } from "react";

import { startSimulation, stopSimulation } from "@/simulation/simulation.runner";
import { useSimulationStore } from "@/state/simulation.store";
import { useUIStore } from "@/state/ui.store";

import { Panel } from "@/components/panel/Panel";
import { Metric } from "@/components/metric/Metric";
import { StatusBadge } from "@/components/status/StatusBadge";

import { AppShell } from "./AppShell";

import carImage from "@/assets/f1-car.png";
import trackImage from "@/assets/track-hockenheim.svg";
import apexMark from "@/assets/apex-racing-mark.svg";

function App() {
  const simulation = useSimulationStore(
    (store) => store.state,
  );

  const selectedDriverId = useUIStore(
    (store) => store.selectedDriverId,
  );

  const driver =
    simulation.drivers[selectedDriverId];

  const car =
    simulation.carTelemetry[selectedDriverId];
    
  useEffect(() => {
    startSimulation();

    return () => {
      stopSimulation();
    };
  }, []);

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col">
        {/* Header */}
        <header className="flex min-h-16 items-center justify-between border-b border-[var(--border)] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)]">
              <img
                src={apexMark}
                alt="Apex Racing"
                className="h-5 w-auto"
              />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.08em] text-[var(--text-primary)]">
                APEX RACING
              </div>

              <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Race Control
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <div>
              <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Circuit
              </div>

              <div className="mt-0.5 text-sm font-semibold">
                Hockenheim
              </div>
            </div>

            <div className="h-7 w-px bg-[var(--border)]" />

            <StatusBadge status="live">
              Live Session
            </StatusBadge>
          </div>

          <StatusBadge status="live">LIVE</StatusBadge>
        </header>

        {/* Main dashboard */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5">
          <div className="grid gap-3 lg:grid-cols-12">
            {/* Race status */}
            <Panel
              eyebrow="Race Status"
              title="Driver 07"
              className="lg:col-span-4"
            >
              <div className="grid grid-cols-2 gap-5 p-4 sm:grid-cols-4 lg:grid-cols-2">
                <Metric
                  label="Position"
                  value={`P${driver.race.position}`}
                  accent
                />

                <Metric
                  label="Lap"
                  value={`${driver.race.lap} / ${driver.race.totalLaps}`}
                />

                <Metric
                  label="Current Lap"
                  value={driver.race.currentLapTime}
                />

                <Metric
                  label="Best Lap"
                  value={driver.race.bestLap}
                />
              </div>
            </Panel>

            {/* Speed */}
            <Panel
              eyebrow="Performance"
              title="Car Telemetry"
              className="lg:col-span-4"
            >
              <div className="grid grid-cols-2 gap-5 p-4">
                <Metric
                  label="Top Speed"
                  value={driver.race.topSpeedKmh}
                  unit="km/h"
                  accent
                />

                <Metric
                  label="RPM"
                  value="9,800"
                  unit="rpm"
                />

                <Metric
                  label="Engine"
                  value={car.engineTempC.toFixed(1)}
                  unit="°C"
                />

                <Metric
                  label="Fuel"
                  value={car.fuelPercent.toFixed(1)}
                  unit="%"
                />
              </div>
            </Panel>

            {/* Weather */}
            <Panel
              eyebrow="Track Conditions"
              title="Weather"
              className="lg:col-span-4"
            >
              <div className="grid grid-cols-2 gap-5 p-4">
                <Metric
                  label="Air"
                  value={simulation.weather.airTempC.toFixed(1)}
                  unit="°C"
                />

                <Metric
                  label="Humidity"
                  value="75"
                  unit="%"
                />

                <Metric
                  label="Pressure"
                  value="1012"
                  unit="mb"
                />

                <Metric
                  label="Wind"
                  value="7"
                  unit="km/h"
                />
              </div>
            </Panel>

            {/* Track */}
            <Panel
              eyebrow="Circuit"
              title="Hockenheimring"
              className="min-h-[360px] lg:col-span-7"
            >
              <div className="flex h-full min-h-[300px] items-center justify-center p-6">
                <img
                  src={trackImage}
                  alt="Hockenheim circuit"
                  className="max-h-[280px] w-full object-contain opacity-80"
                />
              </div>
            </Panel>

            {/* Driver */}
            <Panel
              eyebrow="Selected Driver"
              title="A. NOVA"
              className="min-h-[360px] lg:col-span-5"
            >
              <div className="flex h-full min-h-[300px] items-center justify-center p-6">
                <img
                  src={carImage}
                  alt="Apex Racing car"
                  className="max-h-[280px] w-auto object-contain"
                />
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </AppShell>
  );
}

export default App;