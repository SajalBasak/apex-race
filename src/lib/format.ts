export function formatNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function formatDecimal(
  value: number,
  fractionDigits = 1,
): string {
  return value.toFixed(fractionDigits);
}

export function formatLapTime(
  totalSeconds: number,
): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds
    .toFixed(2)
    .padStart(5, "0")}`;
}