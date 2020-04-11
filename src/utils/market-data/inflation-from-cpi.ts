interface InflationFromCpiOptions {
  startCpi: number;
  endCpi: number;
}

// Given `startCpi` and `endCpi`, returns the inflation.
// This function can be used to compute the inflation between two
// arbitrary years, such as 1871 and 1995.
export default function inflationFromCpi({
  startCpi,
  endCpi,
}: InflationFromCpiOptions): number {
  return endCpi / startCpi;
}
