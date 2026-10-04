import type { CarTelemetry } from "@/features/car/car.types";
import type { DriverState } from "@/features/driver/driver.types";
import type { RaceEvent } from "@/features/events/event.types";
import type { Circuit } from "@/features/race/race.types";
import type { TelemetryPoint } from "@/features/telemetry/telemetry.types";
import type { WeatherState } from "@/features/weather/weather.types";

export interface SimulationState {
  elapsedMs: number;

  circuit: Circuit;

  drivers: Record<string, DriverState>;

  carTelemetry: Record<string, CarTelemetry>;

  telemetryHistory: Record<string, TelemetryPoint[]>;

  weather: WeatherState;

  events: RaceEvent[];
}