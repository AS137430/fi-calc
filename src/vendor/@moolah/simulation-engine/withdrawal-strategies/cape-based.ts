import { clamp } from '../../../@moolah/lib';

export interface CapeBasedOptions {
  portfolioTotalValue: number;
  cape: number;
  inflation: number;
  withdrawalRate: number;
  capeWeight: number;
  avgMarketDataCape: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

// This method uses the CAEY (CAEY = 1/CAPE) to determine withdrawal rates.
// This withdrawal method is included in cFIREsim, but for this implementation I referenced:
// https://earlyretirementnow.com/2017/08/30/the-ultimate-guide-to-safe-withdrawal-rates-part-18-flexibility-cape-based-rules/
export default function capeBased({
  portfolioTotalValue,
  withdrawalRate,
  inflation,
  capeWeight,
  cape,
  minWithdrawal,
  maxWithdrawal,
}: CapeBasedOptions): number {
  const caey = 1 / cape;
  const completeWithdrawalRate = withdrawalRate + capeWeight * caey;

  return clamp(
    completeWithdrawalRate * portfolioTotalValue,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
