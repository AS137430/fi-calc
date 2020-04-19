import {
  isRequired,
  numberRequired,
  integerRequired,
  withinYearLimit,
  lessThanEndYear,
  greaterThanStartYear,
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
      default: 1000000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    startYear: {
      type: 'number',
      default: 1931,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        withinYearLimit,
        lessThanEndYear,
      ],
    },

    endYear: {
      type: 'number',
      default: 1960,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        withinYearLimit,
        greaterThanStartYear,
      ],
    },
  },
};
