import _ from 'lodash';
import computedMarketData from './computed-market-data';
import { MarketDataGrowthKeys } from '../run-simulations/run-simulations-interfaces';

let memoizedMarketDataByYear: MarketData | null;

interface YearData {
  cape: string;
  comp: string;
  cpi: string;
  date: string;
  dateFraction: string;
  dateFractionDecimal: string;
  dividend: string;
  dividendYields: number;
  earnings: string;
  lir: string;
  month: string;
  realDividend: string;
  realEarnings: string;
  realPrice: string;
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
  year: string;
}

interface MarketData {
  [Key: string]: YearData;
  [Key: number]: YearData;
}

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
