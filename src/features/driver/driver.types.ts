import type { RaceStatus } from "@/features/race/race.types";

export interface TyreTelemetry {
  tempC: number;
  pressureBar: number;
}

export interface BrakeTelemetry {
  tempC: number;
}

export interface TyreSet {
  fl: TyreTelemetry;
  fr: TyreTelemetry;
  rl: TyreTelemetry;
  rr: TyreTelemetry;
}

export interface BrakeSet {
  fl: BrakeTelemetry;
  fr: BrakeTelemetry;
  rl: BrakeTelemetry;
  rr: BrakeTelemetry;
}

export interface DriverPhysiology {
  heartRateBpm: number;
  breathsPerMin: number;
  stress: number;
}

export interface Driver {
  id: string;
  name: string;
  shortName: string;
  number: number;
  team: string;
}

export interface DriverState extends Driver {
  race: RaceStatus;
  physiology: DriverPhysiology;
  tyres: TyreSet;
  brakes: BrakeSet;
}