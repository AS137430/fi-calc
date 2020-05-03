import { WithdrawalReturn } from './types';

export interface InflationAdjustedOptions {
  firstYearWithdrawal: number;
  inflation?: number;
  adjustForInflation?: boolean;
}

export default function constantDollar({
  inflation = 1,
  adjustForInflation = true,
  firstYearWithdrawal,
}: InflationAdjustedOptions): WithdrawalReturn {
  const value = adjustForInflation
    ? inflation * firstYearWithdrawal
    : firstYearWithdrawal;

  return {
    value,
    meta: {},
  };
}
