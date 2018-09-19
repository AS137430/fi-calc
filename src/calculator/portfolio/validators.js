import {
  isRequired,
  numberRequired,
  greaterThanZero,
  dollarsTooLarge,
} from '../../utils/forms/validators';
import maxDollarInput from '../../utils/forms/max-dollar-input';

export default {
  stockInvestmentValue: [
    isRequired,
    numberRequired,
    greaterThanZero,
    dollarsTooLarge(maxDollarInput),
  ],
};
