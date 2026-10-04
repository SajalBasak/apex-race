import type { DriverState } from "@/features/driver/driver.types";
import type { RaceEvent } from "@/features/events/event.types";
import type { SimulationState } from "./simulation.types";
import type { TelemetryPoint } from "@/features/telemetry/telemetry.types";

import {
  clamp,
  randomBetween,
  randomSign,
} from "./simulation.utils";

const TICK_MS = 1000;
const MAX_TELEMETRY_POINTS = 60;
const TARGET_LAP_SECONDS = 84;

function advanceRaceProgress(
  driver: DriverState,
  deltaMs: number,
): DriverState["race"] {
  const race = driver.race;

  if (
    race.lap >=
      race.totalLaps
  ) {
    return {
      ...race,
      lapProgress: 1,
    };
  }

  const speedFactor =
    clamp(
      race.topSpeedKmh /
        285,
      0.96,
      1.04,
    );

  const progressDelta =
    (deltaMs /
      1000 /
      TARGET_LAP_SECONDS) *
    speedFactor;

  const rawProgress =
    race.lapProgress +
    progressDelta;

  const completedLaps =
    Math.floor(rawProgress);

  const nextLap =
    Math.min(
      race.totalLaps,
      race.lap +
        completedLaps,
    );

  const finished =
    nextLap >= race.totalLaps;

  return {
    ...race,

    lap: nextLap,

    lapProgress: finished
      ? 1
      : rawProgress % 1,
  };
}

function updateTelemetryHistory(
  state: SimulationState,
): SimulationState["telemetryHistory"] {
  const timestampMs = Date.now();

  return Object.fromEntries(
    Object.values(state.drivers).map((driver) => {
      const point: TelemetryPoint = {
        timestampMs,
        elapsedMs: state.elapsedMs,

        heartRateBpm:
          driver.physiology.heartRateBpm,

        breathsPerMin:
          driver.physiology.breathsPerMin,

        stress: driver.physiology.stress,
      };

      const previous =
        state.telemetryHistory[driver.id] ?? [];

      return [
        driver.id,
        [...previous, point].slice(
          -MAX_TELEMETRY_POINTS,
        ),
      ];
    }),
  );
}

function evolveValue(
  current: number,
  drift: number,
  noise: number,
  min: number,
  max: number,
): number {
  return clamp(
    current + drift + randomBetween(-noise, noise),
    min,
    max,
  );
}

function updateDriver(
  driver: DriverState,
  // state: SimulationState,
  deltaMs: number,
): DriverState {
  const progressIncrease = randomBetween(0.008, 0.014);

  let lap = driver.race.lap;
  let lapProgress =
    driver.race.lapProgress + progressIncrease;

  if (lapProgress >= 1) {
    lap += 1;
    lapProgress -= 1;
  }

  // const speed = evolveValue(
  //   driver.race.topSpeedKmh,
  //   randomBetween(-0.5, 0.8),
  //   2.5,
  //   250,
  //   330,
  // );

  const heartRate = evolveValue(
    driver.physiology.heartRateBpm,
    0.03,
    1.3,
    55,
    180,
  );

  const breathing = evolveValue(
    driver.physiology.breathsPerMin,
    0.01,
    0.35,
    8,
    35,
  );

  const stress = evolveValue(
    driver.physiology.stress,
    0.02,
    1.4,
    0,
    100,
  );

  const tyres = {
    fl: {
      tempC: evolveValue(
        driver.tyres.fl.tempC,
        0.08,
        0.7,
        70,
        125,
      ),
      pressureBar: evolveValue(
        driver.tyres.fl.pressureBar,
        0.0003,
        0.004,
        1.05,
        1.4,
      ),
    },

    fr: {
      tempC: evolveValue(
        driver.tyres.fr.tempC,
        0.06,
        0.7,
        70,
        125,
      ),
      pressureBar: evolveValue(
        driver.tyres.fr.pressureBar,
        0.00025,
        0.004,
        1.05,
        1.4,
      ),
    },

    rl: {
      tempC: evolveValue(
        driver.tyres.rl.tempC,
        0.045,
        0.65,
        70,
        125,
      ),
      pressureBar: evolveValue(
        driver.tyres.rl.pressureBar,
        0.0002,
        0.004,
        1.05,
        1.4,
      ),
    },

    rr: {
      tempC: evolveValue(
        driver.tyres.rr.tempC,
        0.05,
        0.65,
        70,
        125,
      ),
      pressureBar: evolveValue(
        driver.tyres.rr.pressureBar,
        0.0002,
        0.004,
        1.05,
        1.4,
      ),
    },
  };

  const nextRace =
    advanceRaceProgress(
      driver,
      deltaMs,
    );

  return {
    ...driver,

    race: nextRace,

    physiology: {
      heartRateBpm: Math.round(heartRate),
      breathsPerMin: Number(
        breathing.toFixed(1),
      ),
      stress: Math.round(stress),
    },

    tyres,
  };
}

function updateCarTelemetry(
  state: SimulationState,
  driverId: string,
) {
  const driver = state.drivers[driverId];
  const current = state.carTelemetry[driverId];

  const speedFactor =
    driver.race.topSpeedKmh / 300;

  return {
    rpm: Math.round(
      evolveValue(
        current.rpm,
        speedFactor * 8,
        140,
        7000,
        12500,
      ),
    ),

    engineTempC: Number(
      evolveValue(
        current.engineTempC,
        0.04,
        0.6,
        90,
        125,
      ).toFixed(1),
    ),

    fuelPercent: Number(
      clamp(
        current.fuelPercent - 0.006,
        0,
        100,
      ).toFixed(2),
    ),

    ersPercent: Number(
      evolveValue(
        current.ersPercent,
        randomSign() * 0.4,
        1.8,
        5,
        100,
      ).toFixed(1),
    ),
  };
}

function updateWeather(
  weather: SimulationState["weather"],
) {
  return {
    airTempC: Number(
      evolveValue(
        weather.airTempC,
        0.002,
        0.04,
        18,
        32,
      ).toFixed(1),
    ),

    cloudCoverPercent: Number(
      evolveValue(
        weather.cloudCoverPercent,
        0.01,
        0.25,
        0,
        100,
      ).toFixed(1),
    ),

    humidityPercent: Number(
      evolveValue(
        weather.humidityPercent,
        0.01,
        0.12,
        40,
        100,
      ).toFixed(1),
    ),

    pressureMb: Number(
      evolveValue(
        weather.pressureMb,
        0,
        0.04,
        990,
        1030,
      ).toFixed(1),
    ),

    windSpeedKmh: Number(
      evolveValue(
        weather.windSpeedKmh,
        0,
        0.3,
        0,
        35,
      ).toFixed(1),
    ),
  };
}

function generateEvent(
  state: SimulationState,
): RaceEvent | null {
  const chance = Math.random();

  if (chance > 0.18) {
    return null;
  }

  const selectedDriver =
    Object.values(state.drivers)[0];

  if (!selectedDriver) {
    return null;
  }

  const tyreHot =
    Object.values(selectedDriver.tyres).some(
      (tyre) => tyre.tempC >= 112,
    );

  if (tyreHot) {
    return {
      id: `event-${Date.now()}`,
      message: "TYRE TEMPERATURE HIGH",
      severity: "caution",
      timestamp: Date.now(),
      driverId: selectedDriver.id,
    };
  }

  const messages = [
    "LAP COMPLETED",
    "SECTOR 2 PERSONAL BEST",
    "DRS AVAILABLE",
    "PIT WINDOW OPEN",
    "ERS DEPLOY MODE",
    "RADIO CHECK OK",
  ];

  const message =
    messages[
      Math.floor(Math.random() * messages.length)
    ];

  return {
    id: `event-${Date.now()}`,
    message,
    severity:
      message === "PIT WINDOW OPEN"
        ? "caution"
        : "info",
    timestamp: Date.now(),
    driverId: selectedDriver.id,
  };
}

export function stepSimulation(
  state: SimulationState,
  deltaMs = TICK_MS,
): SimulationState {
  const drivers = Object.fromEntries(
    Object.values(state.drivers).map((driver) => [
      driver.id,
      updateDriver(driver, deltaMs),
    ]),
  );

  const nextStateWithoutHistory: SimulationState = {
    ...state,

    elapsedMs: state.elapsedMs + deltaMs,

    drivers,

    carTelemetry: Object.fromEntries(
      Object.keys(drivers).map((driverId) => [
        driverId,
        updateCarTelemetry(
          {
            ...state,
            drivers,
          },
          driverId,
        ),
      ]),
    ),

    weather: updateWeather(state.weather),
  };

  const nextState: SimulationState = {
    ...nextStateWithoutHistory,

    telemetryHistory:
      updateTelemetryHistory(
        nextStateWithoutHistory,
      ),
  };

  const event = generateEvent(nextState);

  if (!event) {
    return nextState;
  }

  return {
    ...nextState,

    events: [
      event,
      ...nextState.events,
    ].slice(0, 30),
  };
}