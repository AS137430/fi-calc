import _ from 'lodash';

interface Options {
  duration?: number;
  firstYear?: number;
  lastYear?: number;
}

// Returns an array of starting years for a calculation.
// For now, it returns every year within `market-data.json`, which represents
// a calculation that takes into account all of history. In the future,
// this could be more customizable based on user input.
export default function getStartYears(byYears:number[], options?: Options): number[] {
  const startYears = _.chain(byYears)
    .filter(year => {
      let withinYearRange = true;

      const firstYear = options?.firstYear;
      const lastYear = options?.lastYear;
      if (typeof firstYear === 'number' && typeof lastYear === 'number') {
        withinYearRange = year >= firstYear && year <= lastYear;
      }

      return withinYearRange;
    })
    .value();

  // This is the code that excludes the simulations that would not complete.
  // If we ever want to consider excluded simulations, then we can comment this out.
  // Note: at this time, sims are run synchronously. We would either want to speed them up
  // or run them async before doing this.
  if (options && typeof options.duration === 'number' && !Number.isNaN(options.duration)) {
    return _.dropRight(startYears, options.duration);
  } else {
    return startYears;
  }
}
