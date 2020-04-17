const CSV_HEADER = 'data:text/csv;charset=utf-8,';

export default function arrayToCsvDataURL(arr) {
  let csvDataURL = CSV_HEADER;

  arr.forEach(function(rowArray) {
    let row = rowArray.join(',');
    csvDataURL += row + '\r\n';
  });

  return csvDataURL;
}
