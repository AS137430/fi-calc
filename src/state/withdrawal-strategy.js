import createState from './create-state';
import withdrawalStrategyFormConfig from '../form-config/withdrawal-strategy-form-config';

const [WithdrawalStrategyProvider, useWithdrawalStrategy] = createState(
  withdrawalStrategyFormConfig
);

export default useWithdrawalStrategy;
export { WithdrawalStrategyProvider };
