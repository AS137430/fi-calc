import {
  isRequired,
  numberRequired,
  tooLarge,
  greaterThanZero,
} from '../utils/forms/validators';
import maxDollarInput from '../utils/forms/max-dollar-input';

export default {
  values: {
    stockInvestmentValue: {
      type: 'number',
      default: 1000000,
      validators: [
        isRequired,
        numberRequired,
        greaterThanZero,
        tooLarge(maxDollarInput),
      ],
    },
  },
};
