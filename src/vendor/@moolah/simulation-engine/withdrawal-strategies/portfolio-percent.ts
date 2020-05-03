import { clamp } from '../../../@moolah/lib';
import { WithdrawalReturn } from './types';

export interface PortfolioPercentOptions {
  percentageOfPortfolio: number;
  portfolioTotalValue: number;

  minWithdrawal?: number;
  maxWithdrawal?: number;
}

export default function portfolioPercent({
  portfolioTotalValue,
  percentageOfPortfolio,

  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: PortfolioPercentOptions): WithdrawalReturn {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;

  return {
    value: clamp(naiveComputation, minWithdrawal, maxWithdrawal),
    meta: {},
  };
}
