export function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

export function isValidYear(year: number): boolean {
  // This year range is admittedly arbitrary, but it doesn't seem to make any sense to
  // support years outside of this range.
  return Number.isInteger(year) && year >= 1900 && year <= 3000;
}
