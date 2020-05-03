import { clamp } from '../../../@moolah/lib';
import { WithdrawalReturn } from './types';

export interface CapeBasedOptions {
  portfolioTotalValue: number;
  cape: number;
  withdrawalRate: number;
  capeWeight: number;

  minWithdrawal?: number;
  maxWithdrawal?: number;
}

interface CapeBasedMeta {
  capeBasedWithdrawalRate: number;
  baseWithdrawalRate: number;
  totalWithdrawalRate: number;
}

// This method uses the CAEY (CAEY = 1/CAPE) to determine withdrawal rates.
// This withdrawal method is included in cFIREsim, but for this implementation I referenced:
// https://earlyretirementnow.com/2017/08/30/the-ultimate-guide-to-safe-withdrawal-rates-part-18-flexibility-cape-based-rules/
export default function capeBased({
  portfolioTotalValue,
  withdrawalRate,
  capeWeight,
  cape,
  minWithdrawal = 0,
  maxWithdrawal = Infinity,
}: CapeBasedOptions): WithdrawalReturn<CapeBasedMeta> {
  const caey = 1 / cape;
  const capeBasedWithdrawalRate = capeWeight * caey;
  const totalWithdrawalRate = withdrawalRate + capeBasedWithdrawalRate;

  return {
    value: clamp(
      totalWithdrawalRate * portfolioTotalValue,
      minWithdrawal,
      maxWithdrawal
    ),
    meta: {
      baseWithdrawalRate: withdrawalRate,
      capeBasedWithdrawalRate,
      totalWithdrawalRate,
    },
  };
}
