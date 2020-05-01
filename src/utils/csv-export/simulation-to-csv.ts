import { Simulation } from '../../vendor/@moolah/simulation-engine/types';

export const simulationCsvHeader = [
  'Row ID',
  'Simulation Number',
  'Year Number',
  'Start Year',
  'End Year',
  'Current Year',

  'Portfolio Value',
  'Is Out of Money?',

  'Total Withdrawal Amount',
  'Total Withdrawal Amount (In First Year Dollars)',
  'Base Withdrawal Amount',
  'Additional Withdrawal Amount',

  'Cumulative Inflation',
];

type csvArray = (string | number | boolean)[][];

export default function simulationToCsv(
  simulation: Simulation,
  simulationNumber: number
): csvArray {
  return simulation.resultsByYear.reduce<csvArray>((arr, result, index) => {
    const yearNumber = index + 1;

    const itemId = `${simulationNumber}.${yearNumber}`;

    arr.push([
      itemId,
      simulationNumber,
      yearNumber,
      simulation.startYear,
      simulation.endYear,
      result.year,

      result.endPortfolio.totalValue,
      result.isOutOfMoneyAtEnd,

      result.totalWithdrawalAmount,
      result.totalWithdrawalAmountInFirstYearDollars,
      result.baseWithdrawalAmount,
      result.additionalWithdrawalAmount,

      result.cumulativeInflationSinceFirstYear,
    ]);

    return arr;
  }, []);
}
