export interface TelemetryPoint {
  timestampMs: number;
  elapsedMs: number;

  heartRateBpm: number;
  breathsPerMin: number;
  stress: number;
}