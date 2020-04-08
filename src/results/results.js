import React, { useMemo } from 'react';
import './results.css';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

export default function Results() {
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const result = useMemo(
    () => {
      console.log('what i got', spendingPlan.spendingStrategy);

      return computeResult({
        durationMode: calculatorMode,
        numberOfYears: lengthOfRetirement.numberOfYears,
        startYear: lengthOfRetirement.startYear,
        endYear: lengthOfRetirement.endYear,
        firstYearWithdrawal: spendingPlan.annualSpending,
        inflationAdjustedFirstYearWithdrawal:
          spendingPlan.inflationAdjustedFirstYearWithdrawal,
        stockInvestmentValue: portfolio.stockInvestmentValue,
      });
    },
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  return (
    <div className="results">
      <h1>Results</h1>
      {calculatorMode === 'allHistory' && (
        <div>Success Rate: {result.successRate}</div>
      )}
      {calculatorMode !== 'allHistory' && (
        <div>Succeeded?: {result.summary === 'SUCCESSFUL' ? 'Yes' : 'No'}</div>
      )}
    </div>
  );
}
