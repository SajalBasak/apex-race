export interface Circuit {
  name: string;
  country: string;
  totalLaps: number;
}

export interface RaceStatus {
  position: number;
  lap: number;
  totalLaps: number;
  lapProgress: number;
  currentLapTime: string;
  bestLap: string;
  topSpeedKmh: number;
}