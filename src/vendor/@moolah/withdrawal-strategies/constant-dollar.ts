import { WithdrawalReturn } from './types';

export interface ConstantDollarOptions {
  firstYearWithdrawal: number;
  inflation?: number;
  adjustForInflation?: boolean;
}

export default function constantDollar({
  inflation = 1,
  adjustForInflation = true,
  firstYearWithdrawal,
}: ConstantDollarOptions): WithdrawalReturn {
  const value = adjustForInflation
    ? inflation * firstYearWithdrawal
    : firstYearWithdrawal;

  return {
    value,
    meta: null,
  };
}
