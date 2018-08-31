import _ from 'lodash';
import {
  isRequired,
  numberRequired,
  integerRequired,
  greaterThanZero,
  withinDollarLimit,
  tooLarge,
} from '../utils/forms/validators';
import marketDataByYear from '../utils/market-data/market-data-by-year';

const marketData = marketDataByYear();
// If the duration goes higher than the number of years in our market data, then no cycles complete,
// and we cannot output any results.
const maxDuration = _.size(marketData);

export default {
  // Ensure this is larger than firstYearWithdrawal
  stockInvestmentValue: [
    isRequired,
    numberRequired,
    greaterThanZero,
    withinDollarLimit,
  ],
  // Ensure this is smaller than stockInvestmentValue
  firstYearWithdrawal: [
    isRequired,
    numberRequired,
    greaterThanZero,
    withinDollarLimit,
  ],
  duration: [
    isRequired,
    numberRequired,
    integerRequired,
    greaterThanZero,
    tooLarge(maxDuration),
  ],
};
