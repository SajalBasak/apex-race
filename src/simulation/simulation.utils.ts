export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(
  from: number,
  to: number,
  amount: number,
): number {
  return from + (to - from) * amount;
}

export function randomBetween(
  min: number,
  max: number,
): number {
  return min + Math.random() * (max - min);
}

export function randomSign(): number {
  return Math.random() < 0.5 ? -1 : 1;
}