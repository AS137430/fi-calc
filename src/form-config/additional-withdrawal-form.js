import {
  isRequired,
  numberRequired,
  integerRequired,
  tooSmall,
  tooLarge,
} from '../utils/forms/validators';
import maxDollarInput from '../utils/forms/max-dollar-input';

export default {
  values: {
    name: {
      type: 'string',
      default: '',
      validators: [],
    },

    value: {
      type: 'number',
      default: 0,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    inflationAdjusted: {
      type: 'boolean',
      default: false,
    },

    duration: {
      type: 'number',
      default: 1,
      validators: [isRequired, numberRequired, integerRequired, tooSmall(1)],
    },

    startYear: {
      type: 'number',
      default: 5,
      validators: [isRequired, numberRequired, integerRequired, tooSmall(0)],
    },
  },
};
