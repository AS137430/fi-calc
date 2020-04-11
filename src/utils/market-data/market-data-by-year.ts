import _ from 'lodash';
import computedMarketData from './computed-market-data';
import { MarketData } from '../run-simulations/run-simulations-interfaces';

let memoizedMarketDataByYear: MarketData | null;

// The market-data.json file is an Array. Finding the data
// within that can be slow, so we memoize an Object, by year,
// for quick lookups.
export default function marketDataByYear(): MarketData {
  if (!memoizedMarketDataByYear) {
    const marketData = computedMarketData();

    memoizedMarketDataByYear = _.chain(marketData)
      // We only look at the first month. Why? Because cFIREsim does, and
      // this is trying to replicate cFIREsim's behavior (for now).
      .filter(data => data.month === '01')
      .keyBy('year')
      .value();
  }

  return memoizedMarketDataByYear as MarketData;
}
