import marketData from 'stock-market-data';
import _ from 'lodash';
import { MarketDataGrowthKeys } from '../run-simulations/run-simulations-interfaces';

// This method is pretty bad right now. It computes calculated data, but
// it looks one year in advance rather than looking by-month. I'll need to
// refactor this to get rid of that +12 once I add in month-to-month
// calculations.
export default function computedMarketData() {
  return _.map(marketData, (data, index) => {
    const nextIndex = index + 12;
    const nextYearData = marketData[nextIndex];

    let stockMarketGrowth = 0;
    if (nextYearData) {
      stockMarketGrowth = nextYearData.comp / data.comp - 1;
    }

    const dividendYields = data.dividend / data.comp;

    return {
      ...data,
      [MarketDataGrowthKeys.stockMarketGrowth]: stockMarketGrowth,
      [MarketDataGrowthKeys.none]: 0,
      dividendYields,
    };
  });
}
