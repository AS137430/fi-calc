import createState from './create-state';
import spendingPlanForm from '../form-config/spending-plan-form';

const [SpendingPlanProvider, useSpendingPlan] = createState(spendingPlanForm);

export default useSpendingPlan;
export { SpendingPlanProvider };
