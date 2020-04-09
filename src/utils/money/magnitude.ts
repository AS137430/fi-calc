// Returns the "magnitude" of a number.
// Magnitude is one of:
//
// "billions" - the number is in the billions
// "millions" - the number is in the millions
// "thousands" - the number is in the thousands
// null - None of the above
export default function magnitude(value: String = '0'): String | null {
  const stringValue = String(value);
  const dollars = stringValue.split('.')[0];

  if (dollars.length > 9) {
    return 'billions';
  } else if (dollars.length > 6) {
    return 'millions';
  } else if (dollars.length > 3) {
    return 'thousands';
  } else {
    return null;
  }
}
