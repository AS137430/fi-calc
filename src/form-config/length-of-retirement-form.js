import _ from 'lodash';
import {
  isRequired,
  numberRequired,
  integerRequired,
  tooLarge,
  greaterThanZero,
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
  },
};
