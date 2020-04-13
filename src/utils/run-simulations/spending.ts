import clamp from '../numbers/clamp';
import { SpendingMethods, Portfolio } from './run-simulations-interfaces';

// These are different methods to calculate the spending amount
// for a given year.
// They all receive the same arguments.

interface SpendingOptions {
  initialPortfolio: Portfolio;
  firstYearWithdrawal: number;
  inflation: number;
  portfolioTotalValue: number;
  percentageOfPortfolio: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  gkInitialSpending: number;
  gkWithdrawalUpperLimit: number;
  gkWithdrawalLowerLimit: number;
  gkUpperLimitAdjustment: number;
  gkLowerLimitAdjustment: number;
  gkIgnoreLastFifteenYears: boolean;
}

function inflationAdjusted({
  inflation,
  firstYearWithdrawal,
}: SpendingOptions): number {
  return inflation * firstYearWithdrawal;
}

function notInflationAdjusted({
  firstYearWithdrawal,
}: SpendingOptions): number {
  return firstYearWithdrawal;
}

function portfolioPercent({
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

function guytonKlinger({
  inflation,
  portfolioTotalValue,
  gkInitialSpending,
  initialPortfolio,
  gkWithdrawalUpperLimit,
  gkWithdrawalLowerLimit,
  gkUpperLimitAdjustment,
  gkLowerLimitAdjustment,
  gkIgnoreLastFifteenYears,
}: SpendingOptions): number {
  // First, we compute the initial % withdrawal. For instance, 40k out of $1mil would be a 4% withdrawal.
  const initialWithdrawalRate = gkInitialSpending / initialPortfolio.totalValue;

  // We use that initial withdrawal rate to compute the max/min withdrawals that apply for every subsequent year
  const withdrawalRateUpperLimit =
    initialWithdrawalRate * (1 + gkWithdrawalUpperLimit / 100);
  const withdrawalRateLowerLimit =
    initialWithdrawalRate * (1 - gkWithdrawalLowerLimit / 100);

  // Next, we compute the "unrestrained" withdrawal rate, which is what our rate would be without the limits.
  const unrestrainedWithdrawal = initialWithdrawalRate * portfolioTotalValue;
  const unrestrainedWithdrawalRate =
    unrestrainedWithdrawal / initialPortfolio.totalValue;

  // These are booleans that represent whether the unrestrained rate we calculated is beyond the limits
  const withdrawalIsTooMuch =
    unrestrainedWithdrawal >= withdrawalRateUpperLimit;
  const withdrawalIsTooLittle =
    unrestrainedWithdrawal <= withdrawalRateLowerLimit;

  let actualWithdrawalRate = unrestrainedWithdrawalRate;

  // Guyton-Klinger says you can ignore the limits when there are 15 or less years left in your retirement.
  // If the user has specified that, then we adhere to it.
  if (gkIgnoreLastFifteenYears /* && yearsLeft <= 15 */) {
    actualWithdrawalRate = unrestrainedWithdrawalRate;
  }
  // Otherwise, we check if the withdrawal exceeds our limit, and if it does, we adjust the withdrawal rate
  // according to what the user specified.
  else if (withdrawalIsTooMuch) {
    actualWithdrawalRate =
      unrestrainedWithdrawalRate * (1 - gkUpperLimitAdjustment / 100);
  }
  // We do a similar check for when the withdrawal is too little.
  else if (withdrawalIsTooLittle) {
    actualWithdrawalRate =
      unrestrainedWithdrawalRate * (1 + gkLowerLimitAdjustment / 100);
  }

  // Lastly, we can use whatever rate we calculated to compute our actual (inflation-adjusted) withdrawal amount.
  return actualWithdrawalRate * portfolioTotalValue * inflation;
}

export default {
  [SpendingMethods.inflationAdjusted]: inflationAdjusted,
  [SpendingMethods.notInflationAdjusted]: notInflationAdjusted,
  [SpendingMethods.portfolioPercent]: portfolioPercent,
  [SpendingMethods.guytonKlinger]: guytonKlinger,
};
