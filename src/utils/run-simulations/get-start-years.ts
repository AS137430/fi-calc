import _ from 'lodash';
import marketData from 'stock-market-data';

// Returns an array of starting years for a calculation.
// For now, it returns every year within `market-data.json`, which represents
// a calculation that takes into account all of history. In the future,
// this could be more customizable based on user input.
export default function getStartYears(duration: number): Array<number> {
  const startYears = _.chain(marketData)
    .filter(data => data.month === 1)
    .map(data => Number(data.year))
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
