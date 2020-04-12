export default function formatForDisplay(
  value: number,
  digits = 2,
  { includeDollarSign = true } = {}
) {
  const isNegative = value < 0;
  const suffix = isNegative ? '-' : '';
  const dollarSign = includeDollarSign ? '$' : '';

  return `${suffix}${dollarSign}${Math.abs(value).toLocaleString('en', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}
