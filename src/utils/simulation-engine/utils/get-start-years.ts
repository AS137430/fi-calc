import _ from 'lodash';
import marketData from 'stock-market-data';

interface Options {
  firstYear: number;
  lastYear: number;
}

// Returns an array of starting years for a calculation.
// For now, it returns every year within `market-data.json`, which represents
// a calculation that takes into account all of history. In the future,
// this could be more customizable based on user input.
export default function getStartYears(duration: number, options?: Options): number[] {
  const startYears = _.chain(marketData)
    .filter(data => {
      // In this calculator, we only consider the first month of each year at this time
      const firstMonth = data.month === 1;

      let withinYearRange = true;

      const firstYear = options?.firstYear;
      const lastYear = options?.lastYear;
      if (typeof firstYear === 'number' && typeof lastYear === 'number') {
        withinYearRange = data.year >= firstYear && data.year <= lastYear;
      }

      return firstMonth && withinYearRange;
    })
    .map(data => data.year)
    .value();

  // This is the code that excludes the simulations that would not complete.
  // If we ever want to consider excluded simulations, then we can comment this out.
  // Note: at this time, sims are run synchronously. We would either want to speed them up
  // or run them async before doing this.
  if (typeof duration === 'number' && !Number.isNaN(duration)) {
    return _.dropRight(startYears, duration);
  } else {
    return startYears;
  }
}
