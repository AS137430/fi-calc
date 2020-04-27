import createState from './create-state';
import withdrawalPlanFormConfig from '../form-config/withdrawal-plan-form-config';

const [WithdrawalPlanProvider, useWithdrawalPlan] = createState(
  withdrawalPlanFormConfig
);

export default useWithdrawalPlan;
export { WithdrawalPlanProvider };
