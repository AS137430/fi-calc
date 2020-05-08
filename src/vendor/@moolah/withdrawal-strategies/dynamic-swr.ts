import clampWithMeta from './utils/clamp-with-meta';
import { WithdrawalReturn, MinMaxMeta } from './types';

export interface DynamicSwrOptions {
  yearsRemaining: number;
  portfolioTotalValue: number;
  dynamicSwrRoiAssumption: number;
  dynamicSwrInflationAssumption: number;
  inflation: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

export default function dynamicSwr({
  yearsRemaining,
  portfolioTotalValue,
  dynamicSwrRoiAssumption,
  dynamicSwrInflationAssumption,
  inflation,
  minWithdrawal,
  maxWithdrawal,
}: DynamicSwrOptions): WithdrawalReturn<MinMaxMeta> {
  let withdrawalAmount = 0;

  if (dynamicSwrInflationAssumption === dynamicSwrRoiAssumption) {
    withdrawalAmount = portfolioTotalValue / (yearsRemaining + 1);
  } else {
    withdrawalAmount =
      (portfolioTotalValue *
        (dynamicSwrRoiAssumption / 100 - dynamicSwrInflationAssumption / 100)) /
      (1 -
        Math.pow(
          (1 + dynamicSwrInflationAssumption / 100) /
            (1 + dynamicSwrRoiAssumption / 100),
          yearsRemaining + 1
        ));
  }

  const clampedValue = clampWithMeta(
    withdrawalAmount,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );

  return {
    value: clampedValue.val,
    meta: {
      minWithdrawalMade: clampedValue.minimumApplied,
      maxWithdrawalMade: clampedValue.maximumApplied,
    },
  };
}
