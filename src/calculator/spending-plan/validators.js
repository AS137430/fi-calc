import {
  isRequired,
  numberRequired,
  greaterThanZero,
  dollarsTooLarge,
} from '../../utils/forms/validators';
import maxDollarInput from '../../utils/forms/max-dollar-input';

export default {
  firstYearWithdrawal: [
    isRequired,
    numberRequired,
    greaterThanZero,
    dollarsTooLarge(maxDollarInput),
  ],
};
