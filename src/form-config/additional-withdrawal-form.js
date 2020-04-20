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

    repeats: {
      type: 'boolean',
      default: false,
    },

    startYear: {
      type: 'number',
      default: 5,
      validators: [isRequired, numberRequired, integerRequired, tooSmall(0)],
    },

    endYear: {
      type: 'number',
      default: 8,
      validators: [isRequired, numberRequired, integerRequired, tooSmall(0)],
    },
  },
};
