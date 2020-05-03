import { WithdrawalReturn } from './types';

export interface NotInflationAdjustedOptions {
  firstYearWithdrawal: number;
}

export default function notInflationAdjusted({
  firstYearWithdrawal,
}: NotInflationAdjustedOptions): WithdrawalReturn {
  return {
    value: firstYearWithdrawal,
    meta: {},
  };
}
