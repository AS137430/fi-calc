import {
  isRequired,
  numberRequired,
  integerRequired,
  withinYearLimit,
  lessThanValue,
  greaterThanValue,
} from '../utils/forms/validators';
import getYearRange from '../utils/market-data/get-year-range';

const { minYear, maxYear } = getYearRange();

export default {
  values: {
    useAllHistoricalData: {
      type: 'boolean',
      default: true,
    },

    firstYear: {
      type: 'number',
      default: 1926,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        withinYearLimit,
        lessThanValue('lastYear'),
      ],
    },

    lastYear: {
      type: 'number',
      default: maxYear,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        withinYearLimit,
        greaterThanValue('firstYear'),
      ],
    },
  },
};
