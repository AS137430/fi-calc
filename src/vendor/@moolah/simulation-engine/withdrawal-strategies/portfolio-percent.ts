import { clamp } from '../../../@moolah/lib';

export interface PortfolioPercentOptions {
  percentageOfPortfolio: number;
  portfolioTotalValue: number;

  inflation?: number;
  minWithdrawal?: number;
  maxWithdrawal?: number;
}

export default function portfolioPercent({
  portfolioTotalValue,
  percentageOfPortfolio,

  inflation = 1,
  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: PortfolioPercentOptions): number {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  return clamp(
    naiveComputation,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
