export default function addMonths(date, months) {
  const possibleNewMonth = date.month + months;

  let month;
  let year;

  if (possibleNewMonth > 12) {
    const addedYears = Math.floor(possibleNewMonth / 12);
    year = date.year + addedYears;
    month = possibleNewMonth - addedYears * 12;
  } else if (possibleNewMonth < 1) {
    const subtractedYears = Math.floor((possibleNewMonth - 1) / 12);
    year = date.year + subtractedYears;
    month = possibleNewMonth - subtractedYears * 12;
  } else {
    year = date.year;
    month = possibleNewMonth;
  }

  return {
    year,
    month,
  };
}
