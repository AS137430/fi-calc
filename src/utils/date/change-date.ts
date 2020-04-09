import getMonthAndYearFromDate from './get-month-and-year-from-date';

export interface ChangeMonthOptions {
  month: number;
  year: number;
  numberOfMonths: number;
}

export function changeMonth({
  month,
  year,
  numberOfMonths,
}: ChangeMonthOptions) {
  var mutableDate = new Date(year, month - 1, 1);
  mutableDate.setMonth(mutableDate.getMonth() + numberOfMonths);
  return getMonthAndYearFromDate(mutableDate);
}
