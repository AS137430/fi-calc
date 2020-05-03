import { clamp } from '../../../@moolah/lib';

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
}: PortfolioPercentOptions): number {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  return clamp(naiveComputation, minWithdrawal, maxWithdrawal);
}
