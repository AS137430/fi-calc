import clamp from '../numbers/clamp';

// These are different methods to calculate the spending amount
// for a given year.
// They all receive the same arguments.

export function inflationAdjusted({ inflation, firstYearWithdrawal }) {
  return inflation * firstYearWithdrawal;
}

export function notInflationAdjusted({ firstYearWithdrawal }) {
  return firstYearWithdrawal;
}

export function portfolioPercent({
  inflation,
  portfolioTotalValue,
  percentageOfPortfolio,
  minWithdrawal,
  maxWithdrawal,
}) {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  const clamped = clamp(
    naiveComputation,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
  return clamped;
}
