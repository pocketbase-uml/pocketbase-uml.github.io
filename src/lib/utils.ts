export function stripBackslashes(s: string) {
  return s.replaceAll('\\', '');
}

export function spaces(n: number) {
  return n < 1 ? '' : ' '.repeat(n);
}

export function absRoundedHalfDiff(a: number, b: number) {
  return Math.round(Math.abs(a - b) / 2);
}

export function constrain(n: number, intervalStart: number, intervalEnd: number) {
  return intervalStart < intervalEnd
    ? Math.min(Math.max(n, intervalStart), intervalEnd)
    : Math.min(Math.max(n, intervalEnd), intervalStart);
}
