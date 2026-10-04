import seed from "./sample-drivers.json";

import type { DriverState } from "@/features/driver/driver.types";
import type { CarTelemetry } from "@/features/car/car.types";
import type { RaceEvent } from "@/features/events/event.types";
import type { SimulationState } from "@/simulation/simulation.types";
import type { WeatherState } from "@/features/weather/weather.types";

import type { TelemetryPoint } from "@/features/telemetry/telemetry.types";

function createInitialTelemetryHistory(
  drivers: Record<string, DriverState>,
): Record<string, TelemetryPoint[]> {
  const now = Date.now();

  return Object.fromEntries(
    Object.values(drivers).map((driver) => [
      driver.id,
      [
        {
          timestampMs: now,
          elapsedMs: 0,
          heartRateBpm:
            driver.physiology.heartRateBpm,
          breathsPerMin:
            driver.physiology.breathsPerMin,
          stress: driver.physiology.stress,
        },
      ],
    ]),
  );
}

function createDriverState(
  driver: (typeof seed.drivers)[number],
): DriverState {
  const baseline = driver.baseline;

  return {
    id: driver.id,
    name: driver.name,
    shortName: driver.shortName,
    number: driver.number,
    team: driver.team,

    race: {
      position: baseline.position,
      lap: baseline.lap,
      totalLaps: seed.circuit.totalLaps,
      lapProgress: 0.42,
      currentLapTime: "1:24.18",
      bestLap: baseline.bestLap,
      topSpeedKmh: baseline.topSpeedKmh,
    },

    physiology: {
      heartRateBpm: baseline.heartRateBpm,
      breathsPerMin: baseline.breathsPerMin,
      stress: baseline.stress,
    },

    tyres: {
      fl: { ...baseline.tyres.fl },
      fr: { ...baseline.tyres.fr },
      rl: { ...baseline.tyres.rl },
      rr: { ...baseline.tyres.rr },
    },

    brakes: {
      fl: { ...baseline.brakes.fl },
      fr: { ...baseline.brakes.fr },
      rl: { ...baseline.brakes.rl },
      rr: { ...baseline.brakes.rr },
    },
  };
}

function createCarTelemetry(
  driver: (typeof seed.drivers)[number],
): CarTelemetry {
  return {
    rpm: driver.baseline.rpm,
    engineTempC: driver.baseline.engineTempC,
    fuelPercent: driver.baseline.fuelPercent,
    ersPercent: 76,
  };
}

function createWeather(): WeatherState {
  return {
    airTempC: seed.weatherBaseline.airTempC,
    cloudCoverPercent: seed.weatherBaseline.cloudCoverPercent,
    humidityPercent: seed.weatherBaseline.humidityPercent,
    pressureMb: seed.weatherBaseline.pressureMb,
    windSpeedKmh: seed.weatherBaseline.windSpeedKmh,
  };
}

function createInitialEvents(): RaceEvent[] {
  const now = Date.now();

  return seed.sampleEvents.slice(0, 4).map((message, index) => ({
    id: `initial-event-${index}`,
    message,
    severity:
      message.includes("YELLOW")
        ? "critical"
        : message.includes("HIGH")
          ? "caution"
          : "info",
    timestamp: now - (4 - index) * 15_000,
  }));
}

export function createInitialSimulation(): SimulationState {
  const drivers = Object.fromEntries(
    seed.drivers.map((driver) => [
      driver.id,
      createDriverState(driver),
    ]),
  );

  const carTelemetry = Object.fromEntries(
    seed.drivers.map((driver) => [
      driver.id,
      createCarTelemetry(driver),
    ]),
  );

  return {
    elapsedMs: 0,

    circuit: {
      ...seed.circuit,
    },

    drivers,

    carTelemetry,

    telemetryHistory:
      createInitialTelemetryHistory(drivers),

    weather: createWeather(),

    events: createInitialEvents(),
  };
}