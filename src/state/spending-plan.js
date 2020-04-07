import createState from './create-state';
import spendingPlanForm from '../form-config/spending-plan-form';

const [SpendingPlanProvider, useSpendingPlanContext] = createState(
  spendingPlanForm
);

export default useSpendingPlanContext;
export { SpendingPlanProvider };
