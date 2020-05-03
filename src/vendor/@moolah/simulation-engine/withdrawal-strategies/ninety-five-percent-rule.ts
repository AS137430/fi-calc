import { clamp } from '../../../@moolah/lib';
import { WithdrawalReturn } from './types';

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
}: NinetyFivePercentRuleOptions): WithdrawalReturn {
  const firstYearWithdrawal =
    firstYearStartPortolioTotalValue * initialWithdrawalRate;

  if (isFirstYear) {
    return {
      value: clamp(firstYearWithdrawal, minWithdrawal, maxWithdrawal),
      meta: null,
    };
  }

  const reducedPreviousWithdrawal =
    previousYearWithdrawalAmount * previousYearWithdrawalPercentage;
  const currentWithdrawal = portfolioTotalValue * initialWithdrawalRate;

  return {
    value: clamp(
      Math.max(reducedPreviousWithdrawal, currentWithdrawal),
      minWithdrawal,
      maxWithdrawal
    ),
    meta: null,
  };
}
