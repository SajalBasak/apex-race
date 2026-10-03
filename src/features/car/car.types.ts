export interface CarTelemetry {
  rpm: number;
  engineTempC: number;
  fuelPercent: number;

  /**
   * ERS = Energy Recovery System charge available to the driver.
   * Represented as a percentage of usable energy deployment reserve.
   */
  ersPercent: number;
}