import {
  isRequired,
  numberRequired,
  integerRequired,
  greaterThanZero,
  withinYearLimit,
  lessThanEndYear,
  greaterThanStartYear,
} from '../utils/forms/validators';

export default {
  values: {
    numberOfYears: {
      type: 'number',
      default: 30,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        greaterThanZero,
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
