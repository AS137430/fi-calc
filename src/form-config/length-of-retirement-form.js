import _ from 'lodash';
import {
  isRequired,
  numberRequired,
  integerRequired,
  tooLarge,
  greaterThanZero,
  withinYearLimit,
  lessThanEndYear,
  greaterThanStartYear,
} from '../utils/forms/validators';
import marketDataByYear from '../utils/market-data/market-data-by-year';

const marketData = marketDataByYear();
// If the duration goes higher than the number of years in our market data, then no cycles complete,
// and we cannot output any results.
const maxDuration = _.size(marketData);

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
        tooLarge(maxDuration),
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
