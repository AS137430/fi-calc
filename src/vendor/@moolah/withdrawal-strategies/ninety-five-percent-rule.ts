import clampWithMeta from './utils/clamp-with-meta';
import { WithdrawalReturn, MinMaxMeta } from './types';

export interface NinetyFivePercentRuleOptions {
  initialWithdrawalRate: number;
  firstYearStartPortolioTotalValue: number;
  portfolioTotalValue: number;
  previousYearWithdrawalAmount: number;
  isFirstYear: boolean;
  previousYearWithdrawalPercentage?: number;

  minWithdrawal?: number;
  maxWithdrawal?: number;
}

interface NinetyFivePercentRuleMeta extends MinMaxMeta {
  ruleApplied: boolean;
}

// Algorithm from "Work Less, Live More"
// Clarified by a post on this forum: https://www.early-retirement.org/forums/f28/question-on-the-95-rule-20484.html
export default function ninetyFivePercentRule({
  isFirstYear,
  initialWithdrawalRate,
  firstYearStartPortolioTotalValue,
  portfolioTotalValue,
  previousYearWithdrawalAmount,
  previousYearWithdrawalPercentage = 0.95,
  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: NinetyFivePercentRuleOptions): WithdrawalReturn<NinetyFivePercentRuleMeta> {
  const firstYearWithdrawal =
    firstYearStartPortolioTotalValue * initialWithdrawalRate;

  if (isFirstYear) {
    const clampedValue = clampWithMeta(
      firstYearWithdrawal,
      minWithdrawal,
      maxWithdrawal
    );

    return {
      value: clampedValue.val,
      meta: {
        ruleApplied: false,
        minWithdrawalMade: clampedValue.minimumApplied,
        maxWithdrawalMade: clampedValue.maximumApplied,
      },
    };
  }

  const reducedPreviousWithdrawal =
    previousYearWithdrawalAmount * previousYearWithdrawalPercentage;
  const currentWithdrawal = portfolioTotalValue * initialWithdrawalRate;

  let ruleApplied = reducedPreviousWithdrawal > currentWithdrawal;
  const clampedValue = clampWithMeta(
    Math.max(reducedPreviousWithdrawal, currentWithdrawal),
    minWithdrawal,
    maxWithdrawal
  );

  return {
    value: clampedValue.val,
    meta: {
      ruleApplied,
      minWithdrawalMade: clampedValue.minimumApplied,
      maxWithdrawalMade: clampedValue.maximumApplied,
    },
  };
}
