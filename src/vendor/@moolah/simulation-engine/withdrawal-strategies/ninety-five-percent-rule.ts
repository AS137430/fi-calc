import { clamp } from '../../../@moolah/lib';

export interface NinetyFivePercentRuleOptions {
  initialWithdrawalRate: number;
  firstYearStartPortolioTotalValue: number;
  portfolioTotalValue: number;
  previousYearWithdrawalAmount: number;
  isFirstYear: boolean;
  previousYearWithdrawalPercentage?: number;

  inflation?: number;
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
  inflation = 1,
  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: NinetyFivePercentRuleOptions): number {
  const firstYearWithdrawal =
    firstYearStartPortolioTotalValue * initialWithdrawalRate;

  if (isFirstYear) {
    return clamp(
      firstYearWithdrawal,
      inflation * minWithdrawal,
      inflation * maxWithdrawal
    );
  }

  const reducedPreviousWithdrawal =
    previousYearWithdrawalAmount * previousYearWithdrawalPercentage;
  const currentWithdrawal = portfolioTotalValue * initialWithdrawalRate;

  return clamp(
    Math.max(reducedPreviousWithdrawal, currentWithdrawal),
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
