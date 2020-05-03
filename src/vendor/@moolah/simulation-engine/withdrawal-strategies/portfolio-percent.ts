import { clamp } from '../../../@moolah/lib';

export interface PortfolioPercentOptions {
  inflation: number;
  percentageOfPortfolio: number;
  portfolioTotalValue: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

export default function portfolioPercent({
  inflation,
  portfolioTotalValue,
  percentageOfPortfolio,
  minWithdrawal,
  maxWithdrawal,
}: PortfolioPercentOptions): number {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  return clamp(
    naiveComputation,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
