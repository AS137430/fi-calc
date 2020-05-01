import { LengthOfRetirement, HistoricalDataRange } from '../types';
import getStartYears from './get-start-years';

interface CalculateDurationOptions {
  lengthOfRetirement: LengthOfRetirement;
  historicalDataRange: HistoricalDataRange;
}

interface CalculateDurationReturn {
  lengthOfSimulation: number;
  startYears: number[];
}

export default function calculateDuration({
  lengthOfRetirement,
  historicalDataRange,
}: CalculateDurationOptions): CalculateDurationReturn {
  const { numberOfYears } = lengthOfRetirement;

  let lengthOfSimulation = 0;
  let startYears;

  lengthOfSimulation = numberOfYears;
  // An array of years that we use as a starting year for simulations
  startYears = getStartYears(
    Number(numberOfYears),
    historicalDataRange.useAllHistoricalData ? undefined : historicalDataRange
  );

  return {
    lengthOfSimulation,
    startYears,
  };
}
