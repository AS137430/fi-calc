export default function getMonthAndYearFromDate(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}
