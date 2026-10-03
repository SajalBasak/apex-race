export type EventSeverity = "info" | "caution" | "critical";

export interface RaceEvent {
  id: string;
  message: string;
  severity: EventSeverity;
  timestamp: number;
  driverId?: string;
}