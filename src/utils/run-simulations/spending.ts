import clamp from '../numbers/clamp';

// These are different methods to calculate the spending amount
// for a given year.
// They all receive the same arguments.

interface SpendingOptions {
  firstYearWithdrawal: number;
  inflation: number;
  portfolioTotalValue: number;
  percentageOfPortfolio: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

export function inflationAdjusted({
  inflation,
  firstYearWithdrawal,
}: SpendingOptions): number {
  return inflation * firstYearWithdrawal;
}

export function notInflationAdjusted({
  firstYearWithdrawal,
}: SpendingOptions): number {
  return firstYearWithdrawal;
}

export function portfolioPercent({
  inflation,
  portfolioTotalValue,
  percentageOfPortfolio,
  minWithdrawal,
  maxWithdrawal,
}: SpendingOptions): number {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  const clamped = clamp(
    naiveComputation,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
  return clamped;
}
