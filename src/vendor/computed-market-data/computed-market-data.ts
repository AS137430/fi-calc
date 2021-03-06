import marketData from 'stock-market-data';
import _ from 'lodash';
import { YearMarketData } from '../@moolah/simulation-engine/types';
import { inflationFromCpi } from '../@moolah/lib';
import calculateBondsGrowth from './calculate-bonds-growth';

// This method is pretty bad right now. It computes calculated data, but
// it looks one year in advance rather than looking by-month. I'll need to
// refactor this to get rid of that +12 once I add in month-to-month
// calculations.
export default function computedMarketData(): YearMarketData[] {
  return _.map(marketData, (data, index) => {
    const nextIndex = index + 12;
    const nextYearData = marketData[nextIndex];

    let stockMarketGrowth = 0;
    if (nextYearData) {
      stockMarketGrowth = nextYearData.comp / data.comp - 1;
    }

    const bondsGrowth = calculateBondsGrowth({
      currentYearLir: data.lir / 100,
      nextYearLir: nextYearData ? nextYearData.lir / 100 : undefined,
    });

    const dividendYields = data.dividend / data.comp;

    const startCpi = data.cpi;

    let endCpi = 0;
    if (nextYearData) {
      endCpi = nextYearData.cpi;
    }

    let inflationOverPeriod = 0;
    if (nextYearData) {
      inflationOverPeriod = inflationFromCpi({
        startCpi,
        endCpi,
      });
    }

    return {
      year: data.year,
      month: data.month,
      startCpi,
      endCpi,
      inflationOverPeriod,
      cape: data.cape,
      dividendYields,
      bondsGrowth: bondsGrowth,
      stockMarketGrowth: stockMarketGrowth,
      none: 0,
    };
  });
}
