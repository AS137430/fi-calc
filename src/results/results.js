import React, { useMemo } from 'react';
import './results.css';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import useSpendingPlan from '../state/spending-plan';

export default function Results() {
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: calculatorMode,
        numberOfYears: '30',
        startYear: '1931',
        endYear: '1960',
        firstYearWithdrawal: spendingPlan.annualSpending,
        inflationAdjustedFirstYearWithdrawal: true,
        stockInvestmentValue: '1000000',
      });
    },
    [calculatorMode, ...Object.values(spendingPlan)]
  );

  return (
    <div className="results">
      <h1>Results</h1>
      <div>Success Rate: {result.successRate}</div>
    </div>
  );
}
