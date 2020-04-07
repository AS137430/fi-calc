import React, { useMemo } from 'react';
import './results.css';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

export default function Results() {
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: calculatorMode,
        numberOfYears: lengthOfRetirement.numberOfYears,
        startYear: '1931',
        endYear: '1960',
        firstYearWithdrawal: spendingPlan.annualSpending,
        inflationAdjustedFirstYearWithdrawal:
          spendingPlan.inflationAdjustedFirstYearWithdrawal,
        stockInvestmentValue: '1000000',
      });
    },
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
    ]
  );

  return (
    <div className="results">
      <h1>Results</h1>
      <div>Success Rate: {result.successRate}</div>
    </div>
  );
}
