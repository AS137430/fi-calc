const CSV_PREFIX = 'data:text/csv;charset=utf-8,%EF%BB%BF';

export default function arrayToCsvDataURL(arr) {
  var csvContent = arr.join('\n');
  return CSV_PREFIX + encodeURI(csvContent);
}
