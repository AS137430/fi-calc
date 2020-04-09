export default function addYears(date, years) {
  const newYear = date.year + years;

  return {
    year: newYear,
    month: date.month,
  };
}
