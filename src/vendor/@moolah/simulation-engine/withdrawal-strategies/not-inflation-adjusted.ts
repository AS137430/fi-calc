export interface NotInflationAdjustedOptions {
  firstYearWithdrawal: number;
}

export default function notInflationAdjusted({
  firstYearWithdrawal,
}: NotInflationAdjustedOptions): number {
  return firstYearWithdrawal;
}
