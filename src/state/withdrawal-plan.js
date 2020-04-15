import createState from './create-state';
import withdrawalPlanForm from '../form-config/withdrawal-plan-form';

const [WithdrawalPlanProvider, useWithdrawalPlan] = createState(
  withdrawalPlanForm
);

export default useWithdrawalPlan;
export { WithdrawalPlanProvider };
