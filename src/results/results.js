import React, { useMemo } from 'react';
import './results.css';
import GaussianPlot from './gaussian-plot';
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
        bondsValue: portfolio.bondsValue,
        stockInvestmentValue: portfolio.stockInvestmentValue,
        stockInvestmentFees: portfolio.stockInvestmentFees,
        spendingStrategy: spendingPlan.spendingStrategy.key,
        percentageOfPortfolio: spendingPlan.percentageOfPortfolio,
        minWithdrawalLimit: spendingPlan.minWithdrawalLimit,
        maxWithdrawalLimit: spendingPlan.maxWithdrawalLimit,
      });
    },
    /* eslint react-hooks/exhaustive-deps: "off" */
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  // const excludedCycles =
  //   result.results.totalNumberOfCycles - result.results.numberOfCycles;
  // const cyclesWereExcluded = Boolean(excludedCycles);
  // const cyclesWereWord = excludedCycles > 1 ? 'were' : 'was';
  // const cyclesWord = excludedCycles > 1 ? 'cycles' : 'cycle';

  return (
    <div className="results">
      <h1>Results</h1>
      <div>
        {numberOfSimulations > 1 && (
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div className="results_bigValue">
              {result.results.numberOfCycles}
            </div>
          </div>
        )}
        {oneSimulation && (
          <div className="results_section">
            <div className="results_sectionTitle">Length of Simulation</div>
            <div className="results_bigValue">
              {result.results.allCycles[0].duration + 1} years
            </div>
          </div>
        )}
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
      <div className="results_plotSection">
        <div className="results_sectionTitle">
          Distribution of End Portfolio Value
        </div>
        <GaussianPlot
          gaussian={result.results.gaussian}
          mean={result.results.mean}
          standardDeviation={result.results.standardDeviation}
        />
      </div>
    </div>
  );
}
