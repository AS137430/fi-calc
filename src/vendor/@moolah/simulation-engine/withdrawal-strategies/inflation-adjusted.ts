export interface InflationAdjustedOptions {
  inflation: number;
  firstYearWithdrawal: number;
}

export default function inflationAdjusted({
  inflation,
  firstYearWithdrawal,
}: InflationAdjustedOptions): number {
  return inflation * firstYearWithdrawal;
}
