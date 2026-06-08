export function roundTo(value: number, digits: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundToTwo(value: number): number {
  return roundTo(value, 2);
}
