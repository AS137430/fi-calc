import { WithdrawalReturn } from './types';

export interface InflationAdjustedOptions {
  inflation: number;
  firstYearWithdrawal: number;
}

export default function inflationAdjusted({
  inflation,
  firstYearWithdrawal,
}: InflationAdjustedOptions): WithdrawalReturn {
  return {
    value: inflation * firstYearWithdrawal,
    meta: {},
  };
}
