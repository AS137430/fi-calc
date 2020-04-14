import clamp from '../numbers/clamp';
import {
  SpendingMethods,
  Portfolio,
  YearResult,
  YearData,
} from './run-simulations-interfaces';
import inflationFromCpi from '../market-data/inflation-from-cpi';

// These are different methods to calculate the spending amount
// for a given year.
// They all receive the same arguments.

interface SpendingOptions {
  initialPortfolio: Portfolio;
  isFirstYear: boolean;
  firstYearWithdrawal: number;
  inflation: number;
  cpi: number;
  firstYearCpi: number;
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
  yearMarketData: YearData;
  previousResults: YearResult;
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
  isFirstYear,
  cpi,
  firstYearCpi,
  portfolioTotalValue,
  gkInitialSpending,
  initialPortfolio,
  gkWithdrawalUpperLimit,
  gkWithdrawalLowerLimit,
  gkUpperLimitAdjustment,
  gkLowerLimitAdjustment,
  gkIgnoreLastFifteenYears,
  previousResults,
  yearMarketData,
}: SpendingOptions): number {
  // The first step in the GK computation is determining how much we spent last year. If we're in the
  // first year, then it's just our initial spend value. Otherwise, we look at our previous year's
  // results and grab it from there.
  // We may end up using this value for this year, or we may end up modifying it. These are the outcomes
  // of this calculation:
  //   Outcome 1. We may just use this value as-is, without even adjusting for inflation
  //   Outcome 2. We may adjust this value for this year's inflation
  //   Outcome 3. We may adjust this value for inflation, and then decrease it by a little bit (gkUpperLimitAdjustment)
  //   Outcome 4. We may adjust this value for inflation, and then increase it by a little bit (gkLowerLimitAdjustment)
  const previousSpending = isFirstYear
    ? gkInitialSpending
    : previousResults.computedData.totalWithdrawalAmount;

  const prevCpi = isFirstYear ? firstYearCpi : previousResults.cpi;
  const inflationFromPreviousYear = inflationFromCpi({
    startCpi: prevCpi,
    endCpi: cpi,
  });

  const inflationAdjustedPrevYearWithdrawal =
    previousSpending * inflationFromPreviousYear;

  // The next set of lines implement's GK's "Modified Withdrawal Rule". Excerpt from their original paper:
  //
  // > Withdrawals increase from year to year with the inflation rate, except there is no increase
  // > following a year where the retirement portfolio’s total return is negative and when that year’s
  // > withdrawal rate would be greater than the initial withdrawal rate. There is no make-up for a
  // > missed increase.
  //
  // In short, we need to check for two things:
  //
  // (1) Were our portfolio returns NEGATIVE this year?
  // (2) Is our current withdrawal GREATER than our (inflation-adjusted) first year withdrawal?
  //
  // If both of these are YES, then we "freeze" our spending and use the same exact spend as we did in the previous year.

  // First, we calculate the inflation-adjusted first year withdrawal
  const inflationAdjustedInitialWithdrawal = gkInitialSpending * inflation;

  // Next, we find the answer to (1) by calculating our returns
  const thisYearTotalReturn = yearMarketData.stockMarketGrowth;
  // NOTE: this *only* works right now because this calculator restricts you to equities! When I add in bonds and other
  // asset types, I'll need to smarten this up.
  const thisYearTotalReturnIsNegative = thisYearTotalReturn < 0;

  // Solve for (2) by comparing our current withdrawal with the initial one
  const currentWithdrawalExceedsInitialWithdrawal =
    inflationAdjustedPrevYearWithdrawal > inflationAdjustedInitialWithdrawal;

  // When both (1) and (2) are true, we freeze the withdrawal and use the previous year's result
  const freezeWithdrawal =
    currentWithdrawalExceedsInitialWithdrawal && thisYearTotalReturnIsNegative;

  if (freezeWithdrawal) {
    // Note: this is "Outcome 1" listed above.
    return previousSpending;
  }

  // If we have made it this far in the calculation, then it is time to check for the remaining two rules:
  //   1. Capital Preservation Rule
  //   2. Prosperity Rule
  //
  // From their paper:
  //
  // > Capital Preservation Rule
  // > -------------------------
  // > If the withdrawal rate in any year t would exceed the initial withdrawal rate, IWR, by a percentage greater
  // > than Exceeds, the withdrawal rate for that year is cut by a percentage Cut. That is,
  // >
  // > if (WRt / IWR – 1) > Exceeds, then set WRt to (1 – Cut) × WRt.
  //
  //
  // > Prosperity Rule
  // > ---------------
  // > If the withdrawal rate in any year should fall below the initial withdrawal rate by more than a percentage Fall,
  // > the withdrawal is increased by a percentage Raise. That is,
  // >
  // > if (1 – WRt / IWR ) > Fall, then set WRt to (1 + Raise) × WRt .
  // >
  //
  // Variables:
  // WRt = Current Year's Withdrawal Rate
  // IWR = Initial Withdrawal Rate
  // Exceeds = our upper boundary
  // Cut = the amount to reduce spending by
  // Fall = our lower boundary
  // Raise = the amount to increase spending by
  //

  // To determine if we need to adjust our withdrawal, we first compute the initial year's % withdrawal. For
  // instance, 40k out of $1mil would be a 4% withdrawal.
  const initialWithdrawalRate = gkInitialSpending / initialPortfolio.totalValue;

  // We use that initial withdrawal rate to compute the max/min withdrawals that apply for every subsequent year
  // This is "Exceeds" in the equations above
  const withdrawalRateUpperLimit =
    initialWithdrawalRate * (1 + gkWithdrawalUpperLimit / 100);
  // This is "Fall" in the equations above
  const withdrawalRateLowerLimit =
    initialWithdrawalRate * (1 - gkWithdrawalLowerLimit / 100);

  // If we were to use the inflation-adjusted prev year withdrawal for this year, then
  // this is the % of the current year portfolio value that we would be withdrawing.
  const currentWithdrawalRate =
    inflationAdjustedPrevYearWithdrawal / portfolioTotalValue;

  // These are booleans that represent whether the current withdrawal rate is beyond the limits
  const withdrawalIsTooMuch = currentWithdrawalRate >= withdrawalRateUpperLimit;
  const withdrawalIsTooLittle =
    currentWithdrawalRate <= withdrawalRateLowerLimit;

  // This is the amount that we will adjust our withdrawal by. We start off with 1, which means the withdrawal rate
  // isn't changed at all (currentRate * 1 = currentRate)
  // If none of the conditionals below are met, then this is Outcome 2.
  let withdrawalAdjustment = 1;

  // Guyton-Klinger says you can ignore the limits when there are 15 or less years left in your retirement.
  // If the user has specified that, then we adhere to it.
  if (!gkIgnoreLastFifteenYears /* && yearsLeft <= 15 */) {
    // This is another situation where we return Outcome 2
    withdrawalAdjustment = 1;
  }
  // Otherwise, we check if the withdrawal exceeds our limit, and if it does, we adjust the withdrawal rate
  // according to what the user specified.
  else if (withdrawalIsTooMuch) {
    // This is Outcome 3 above
    withdrawalAdjustment = 1 - gkUpperLimitAdjustment / 100;
  }
  // We do a similar check for when the withdrawal is too little.
  else if (withdrawalIsTooLittle) {
    // This is Outcome 4 above
    withdrawalAdjustment = 1 + gkLowerLimitAdjustment / 100;
  }

  // Alright! We're done. We now know our adjustment, which determines whether we are in Outcome 2, 3, or 4.
  // The last thing for us to do is to apply that adjustment and then account for inflation, and we're done.
  // Phew. That was complicated, but we made it!
  return inflationAdjustedPrevYearWithdrawal * withdrawalAdjustment;
}

export default {
  [SpendingMethods.inflationAdjusted]: inflationAdjusted,
  [SpendingMethods.notInflationAdjusted]: notInflationAdjusted,
  [SpendingMethods.portfolioPercent]: portfolioPercent,
  [SpendingMethods.guytonKlinger]: guytonKlinger,
};
