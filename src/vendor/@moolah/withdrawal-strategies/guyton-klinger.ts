import { inflationFromCpi } from '../../@moolah/lib';
import { WithdrawalReturn, MinMaxMeta } from './types';
import clampWithMeta from './utils/clamp-with-meta';

export interface GuytonKlingerOptions {
  yearsRemaining: number;
  inflation: number;
  isFirstYear: boolean;
  cpi: number;
  portfolioTotalValue: number;
  firstYearStartPortolioTotalValue: number;

  stockMarketGrowth: number;
  previousYearBaseWithdrawalAmount: number;
  previousYearCpi: number;

  initialWithdrawal: number;
  enableModifiedWithdrawalRule?: boolean;
  withdrawalUpperLimit?: number;
  withdrawalLowerLimit?: number;
  upperLimitAdjustment?: number;
  lowerLimitAdjustment?: number;
  ignoreLastFifteenYears?: boolean;

  minWithdrawal?: number;
  maxWithdrawal?: number;
}

export interface GuytonKlingerMeta extends MinMaxMeta {
  modifiedWithdrawalRuleApplied: boolean;
  capitalPreservationRuleApplied: boolean;
  prosperityRuleApplied: boolean;
}

export type GuytonKlingerReturn = WithdrawalReturn<GuytonKlingerMeta>;

// Source for this calculation:
// "Using Decision Rules to Create Retirement Withdrawal Profiles"
// Author: William Klinger
// Publication: Journal of Financial Planning
// Date: August 2007
//
// I also referenced this excellent blog post:
// https://jsevy.com/wordpress/index.php/finance-and-retirement/retirement-withdrawal-strategies-guyton-klinger-as-a-happy-medium/
export default function guytonKlinger({
  yearsRemaining,
  inflation,
  isFirstYear,
  cpi,
  portfolioTotalValue,
  initialWithdrawal,
  firstYearStartPortolioTotalValue,

  stockMarketGrowth,
  previousYearBaseWithdrawalAmount,
  previousYearCpi,

  enableModifiedWithdrawalRule = true,
  withdrawalUpperLimit = 20,
  withdrawalLowerLimit = 20,
  upperLimitAdjustment = 10,
  lowerLimitAdjustment = 10,
  ignoreLastFifteenYears = true,

  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: GuytonKlingerOptions): GuytonKlingerReturn {
  let modifiedWithdrawalRuleApplied = false;
  let capitalPreservationRuleApplied = false;
  let prosperityRuleApplied = false;

  // The first step in the GK computation is determining how much we withdrew last year. If we're in the
  // first year, then it's just our initial withdrawal value. Otherwise, we look at our previous year's
  // results and grab it from there.
  // We may end up using this value for this year, or we may end up modifying it. These are the outcomes
  // of this calculation:
  //
  //   Inflation: we may adjust for inflation, or we may not (Modified Withdrawal Rule)
  //   Adjustment: we may decrease it by a little bit (Capital Preservation Rule / upperLimitAdjustment)
  //   Adjustment: we may increase it by a little bit (Prosperity Rule / lowerLimitAdjustment)
  const previousWithdrawal = isFirstYear
    ? initialWithdrawal
    : previousYearBaseWithdrawalAmount;

  const inflationFromPreviousYear = isFirstYear
    ? 1
    : inflationFromCpi({
        startCpi: previousYearCpi,
        endCpi: cpi,
      });

  const inflationAdjustedPrevYearWithdrawal =
    previousWithdrawal * inflationFromPreviousYear;

  let withdrawalAmountToUse = inflationAdjustedPrevYearWithdrawal;
  if (enableModifiedWithdrawalRule) {
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
    // (3) Will applying inflation INCREASE our withdrawal rate?
    //
    // If all of these are YES, then we "freeze" our withdrawal amount by not applying inflation for this year
    // Note: we will still apply the other two rules after this

    // First, we calculate the inflation-adjusted first year withdrawal
    const inflationAdjustedInitialWithdrawal = initialWithdrawal * inflation;

    // Next, we find the answer to (1) by calculating our returns
    const thisYearTotalReturn = stockMarketGrowth;
    // NOTE: this *only* works right now because this calculator restricts you to equities! When I add in bonds and other
    // asset types, I'll need to smarten this up.
    const thisYearTotalReturnIsNegative = thisYearTotalReturn < 0;

    // Solve for (2) by comparing our current withdrawal with the initial one
    const currentWithdrawalExceedsInitialWithdrawal =
      inflationAdjustedPrevYearWithdrawal > inflationAdjustedInitialWithdrawal;

    // Solve for (3) by checking if our inflation is positive
    const inflationWillIncreaseWithdrawal = inflationFromPreviousYear > 1;

    // When (1), (2), and (3) are true, we freeze the withdrawal and not apply inflation
    const freezeWithdrawal =
      currentWithdrawalExceedsInitialWithdrawal &&
      thisYearTotalReturnIsNegative &&
      inflationWillIncreaseWithdrawal;

    if (freezeWithdrawal) {
      modifiedWithdrawalRuleApplied = true;
      withdrawalAmountToUse = previousWithdrawal;
    }
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
  // Cut = the amount to reduce withdrawal by
  // Fall = our lower boundary
  // Raise = the amount to increase withdrawal by
  //

  // To determine if we need to adjust our withdrawal, we first compute the initial year's % withdrawal. For
  // instance, 40k out of $1mil would be a 4% withdrawal.
  const initialWithdrawalRate =
    initialWithdrawal / firstYearStartPortolioTotalValue;

  // We use that initial withdrawal rate to compute the max/min withdrawals that apply for every subsequent year
  // This is "Exceeds" in the equations above
  const withdrawalRateUpperLimit =
    initialWithdrawalRate * (1 + withdrawalUpperLimit / 100);
  // This is "Fall" in the equations above
  const withdrawalRateLowerLimit =
    initialWithdrawalRate * (1 - withdrawalLowerLimit / 100);

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

  // Ignoring the upper limit for the final 15 years is defined in the GK paper. Excerpt:
  // > This rule is not applied during the final 15 years of the anticipated retirement period. Guyton and Klinger (2006) found
  // > that this restriction increased the total amount of withdrawals during the retirement period without a significant decrease in the success rate.
  // const considerUpperLimit = yearsRemaining >= 15 && !ignoreLastFifteenYears;
  let considerUpperLimit;
  if (ignoreLastFifteenYears) {
    considerUpperLimit = yearsRemaining >= 15;
  } else {
    considerUpperLimit = true;
  }

  if (withdrawalIsTooMuch && considerUpperLimit) {
    capitalPreservationRuleApplied = true;
    withdrawalAdjustment = 1 - upperLimitAdjustment / 100;
  }
  // We do a similar check for when the withdrawal is too little.
  else if (withdrawalIsTooLittle) {
    prosperityRuleApplied = true;
    withdrawalAdjustment = 1 + lowerLimitAdjustment / 100;
  }

  const clampedValue = clampWithMeta(
    withdrawalAmountToUse * withdrawalAdjustment,
    minWithdrawal,
    maxWithdrawal
  );

  // Alright! The last thing for us to do is to apply any adjustment, and we're done.
  // Phew. That was complicated, but we made it!
  return {
    value: clampedValue.val,
    meta: {
      modifiedWithdrawalRuleApplied,
      capitalPreservationRuleApplied,
      prosperityRuleApplied,
      minWithdrawalMade: clampedValue.minimumApplied,
      maxWithdrawalMade: clampedValue.maximumApplied,
    },
  };
}
