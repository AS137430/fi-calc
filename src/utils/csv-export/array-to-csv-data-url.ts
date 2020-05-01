const CSV_PREFIX = 'data:text/csv;charset=utf-8,%EF%BB%BF';

type csvArray = (string | number | boolean)[][];

export default function arrayToCsvDataURL(arr: csvArray): string {
  var csvContent = arr.join('\n');
  return CSV_PREFIX + encodeURI(csvContent);
}
