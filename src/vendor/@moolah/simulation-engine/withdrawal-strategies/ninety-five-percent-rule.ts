import { clamp } from '../../../@moolah/lib';

export interface NinetyFivePercentRuleOptions {
  ninetyFiveInitialRate: number;
  ninetyFivePercentage: number;
  firstYearStartPortolioTotalValue: number;
  portfolioTotalValue: number;
  previousYearBaseWithdrawalAmount: number;
  isFirstYear: boolean;
  inflation: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

// Algorithm from "Work Less, Live More"
// Clarified by a post on this forum: https://www.early-retirement.org/forums/f28/question-on-the-95-rule-20484.html
export default function ninetyFivePercentRule({
  ninetyFiveInitialRate,
  firstYearStartPortolioTotalValue,
  ninetyFivePercentage,
  portfolioTotalValue,
  previousYearBaseWithdrawalAmount,
  isFirstYear,
  inflation,
  minWithdrawal,
  maxWithdrawal,
}: NinetyFivePercentRuleOptions): number {
  const firstYearWithdrawal =
    (firstYearStartPortolioTotalValue * ninetyFiveInitialRate) / 100;

  if (isFirstYear) {
    return firstYearWithdrawal;
  }

  const previousWithdrawal = previousYearBaseWithdrawalAmount;
  const reducedPreviousWithdrawal =
    (previousWithdrawal * ninetyFivePercentage) / 100;
  const currentWithdrawal = (portfolioTotalValue * ninetyFiveInitialRate) / 100;

  return clamp(
    Math.max(reducedPreviousWithdrawal, currentWithdrawal),
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
