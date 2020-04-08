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
      return computeResult({
        durationMode: calculatorMode,
        numberOfYears: lengthOfRetirement.numberOfYears,
        startYear: lengthOfRetirement.startYear,
        endYear: lengthOfRetirement.endYear,
        firstYearWithdrawal: spendingPlan.annualSpending,
        inflationAdjustedFirstYearWithdrawal:
          spendingPlan.inflationAdjustedFirstYearWithdrawal,
        stockInvestmentValue: portfolio.stockInvestmentValue,
        spendingStrategy: spendingPlan.spendingStrategy.key,
        percentageOfPortfolio: spendingPlan.percentageOfPortfolio,
        minWithdrawalLimit: spendingPlan.minWithdrawalLimit,
        maxWithdrawalLimit: spendingPlan.maxWithdrawalLimit,
      });
    },
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  console.log('got the result', result);

  const isAllHistory = calculatorMode === 'allHistory';
  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  return (
    <div className="results">
      <h1>Results</h1>
      {numberOfSimulations > 1 && (
        <div>
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div className="results_bigValue">
              {result.results.numberOfCycles}
            </div>
          </div>
        </div>
      )}
      {oneSimulation && (
        <div>
          <div className="results_section">
            <div className="results_sectionTitle">Length of Simulation</div>
            <div className="results_bigValue">
              {result.results.allCycles[0].duration + 1} years
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="results_section">
          <div className="results_sectionTitle">
            {!oneSimulation ? 'Success Rate' : 'Succeeded?'}
          </div>
          <div className="results_bigValue">
            {!oneSimulation && result.successRate}
            {oneSimulation && (result.summary === 'SUCCESSFUL' ? 'Yes' : 'No')}
          </div>
        </div>
      </div>
    </div>
  );
}
