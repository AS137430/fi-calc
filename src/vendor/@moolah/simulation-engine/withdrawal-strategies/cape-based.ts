import { clamp } from '../../../@moolah/lib';
import { YearData } from '../../../computed-market-data/types';

export interface CapeBasedOptions {
  portfolioTotalValue: number;
  yearMarketData: YearData;
  inflation: number;
  capeWithdrawalRate: number;
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
  yearMarketData,
  capeWithdrawalRate,
  capeWeight,
  avgMarketDataCape,
  inflation,
  minWithdrawal,
  maxWithdrawal,
}: CapeBasedOptions): number {
  const capeToUse =
    yearMarketData.cape === null ? avgMarketDataCape : yearMarketData.cape;
  const caey = 1 / capeToUse;

  const baseWithdrawalRate = capeWithdrawalRate / 100;
  const withdrawalRate = baseWithdrawalRate + capeWeight * caey;

  return clamp(
    withdrawalRate * portfolioTotalValue,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
}
