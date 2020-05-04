import clampWithMeta from '../utils/clamp-with-meta';
import { WithdrawalReturn, MinMaxMeta } from './types';

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
}: PortfolioPercentOptions): WithdrawalReturn<MinMaxMeta> {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;

  const clampedValue = clampWithMeta(
    naiveComputation,
    minWithdrawal,
    maxWithdrawal
  );

  return {
    value: clampedValue.val,
    meta: {
      minWithdrawalMade: clampedValue.minimumApplied,
      maxWithdrawalMade: clampedValue.maximumApplied,
    },
  };
}
