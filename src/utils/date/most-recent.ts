import getMonthAndYearFromDate from './get-month-and-year-from-date';

export interface MostRecent {
  year: number;
  month: number;
}

//
// Some expected results:
//   - Feb. 5th, 2019 would return Dec. 2018
//   - Feb. 25th, 2019 would return Jan. 2019
//
// This gives the user time to enter data for previous months.
//
export function mostRecentMonthAndYear(): MostRecent {
  // The most recent month and year is based off of today's date. We don't use today's date,
  // though, because it's not always the case that net worth for the given date has been entered.
  // For instance, on November 1st you won't know your net worth for November, because...the month
  // hasn't ended yet!
  // What we do is get a time from the past to act as the "most recent" month and year. This assumes
  // that people stay relatively up-to-date with entering their networth.
  //
  // A future update would be smart enough to pick the first month that has real data entered, and
  // it would likely consult the server for that information (since the server would compute it from
  // the data in the DB).
  const mostRecentDate = new Date();

  // We subtract a bunch of days to ensure that we're toward the _end_ of a particular month.
  // If we're at the beginning of a month, then this will have the effect of moving the date
  // back a month.
  mostRecentDate.setDate(mostRecentDate.getDate() - 14);

  // Finally, we subtract 1 month from wherever we landed
  mostRecentDate.setMonth(mostRecentDate.getMonth() - 1);

  return getMonthAndYearFromDate(mostRecentDate);
}
