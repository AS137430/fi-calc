import { clamp } from '../../../@moolah/lib';
import { Portfolio, YearResult } from '../types';

export interface NinetyFivePercentRuleOptions {
  ninetyFiveInitialRate: number;
  ninetyFivePercentage: number;
  firstYearStartPortfolio: Portfolio;
  portfolioTotalValue: number;
  previousResults: YearResult;
  isFirstYear: boolean;
  inflation: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

// Algorithm from "Work Less, Live More"
// Clarified by a post on this forum: https://www.early-retirement.org/forums/f28/question-on-the-95-rule-20484.html
export default function ninetyFivePercentRule({
  ninetyFiveInitialRate,
  firstYearStartPortfolio,
  ninetyFivePercentage,
  portfolioTotalValue,
  previousResults,
  isFirstYear,
  inflation,
  minWithdrawal,
  maxWithdrawal,
}: NinetyFivePercentRuleOptions): number {
  const firstYearWithdrawal =
    (firstYearStartPortfolio.totalValue * ninetyFiveInitialRate) / 100;

  if (isFirstYear) {
    return firstYearWithdrawal;
  }

  const previousWithdrawal = previousResults.baseWithdrawalAmount;
  const reducedPreviousWithdrawal =
    (previousWithdrawal * ninetyFivePercentage) / 100;
  const currentWithdrawal = (portfolioTotalValue * ninetyFiveInitialRate) / 100;

  return clamp(
    Math.max(reducedPreviousWithdrawal, currentWithdrawal),
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
