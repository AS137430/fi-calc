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

export default function simulationToCsv(simulation, simulationNumber) {
  return simulation.resultsByYear.reduce((arr, result, index) => {
    const yearNumber = index + 1;

    const itemId = `${simulationNumber}.${yearNumber}`;

    arr.push([
      itemId,
      simulationNumber,
      yearNumber,
      simulation.startYear,
      simulation.endYear,
      result.year,

      result.computedData.endPortfolio.totalValue,
      result.isOutOfMoney,

      result.computedData.totalWithdrawalAmount,
      result.computedData.totalWithdrawalAmountInFirstYearDollars,
      result.computedData.baseWithdrawalAmount,
      result.computedData.additionalWithdrawalAmount,

      result.computedData.cumulativeInflation,
    ]);

    return arr;
  }, []);
}
