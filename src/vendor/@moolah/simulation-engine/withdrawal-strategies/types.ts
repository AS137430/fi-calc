export interface WithdrawalReturn<WithdrawalMeta = null> {
  meta: WithdrawalMeta;
  value: number;
}

export interface MinMaxMeta {
  minWithdrawalMade: boolean;
  maxWithdrawalMade: boolean;
}
