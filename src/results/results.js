import React, { useMemo } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './results.css';
import GaussianPlot from './gaussian-plot';
import Chart from './chart';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';
import formatNumber from '../utils/numbers/format-number';

function formatCycleForPortfolioChart(cycle) {
  return cycle?.resultsByYear?.map(yearData => {
    return {
      historyKey: `${yearData.year}-01`,
      month: 1,
      year: yearData.year,
      value: yearData.computedData.portfolio.totalValue,
    };
  });
}

function formatCycleForSpendingChart(cycle) {
  return cycle?.resultsByYear?.map(yearData => {
    return {
      historyKey: `${yearData.year}-01`,
      month: 1,
      year: yearData.year,
      value: yearData.computedData.totalWithdrawalAmount,
    };
  });
}

export default function Results() {
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: calculatorMode,
        lengthOfRetirement,
        spendingPlan,
        portfolio,
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

  const isSuccessful = result.summary === 'SUCCESSFUL';

  // const excludedCycles =
  //   result.results.totalNumberOfCycles - result.results.numberOfCycles;
  // const cyclesWereExcluded = Boolean(excludedCycles);
  // const cyclesWereWord = excludedCycles > 1 ? 'were' : 'was';
  // const cyclesWord = excludedCycles > 1 ? 'cycles' : 'cycle';

  let isWarning = false;
  let isDanger = false;

  const { lowestDippedValue } = result;
  const firstCycle = result.results.allCycles[0];

  const finalRatio = firstCycle.finalValue / result.initialPortfolioValue;

  console.log('result', firstCycle, firstCycle.finalValue, result);

  if (oneSimulation) {
    isDanger = !isSuccessful || finalRatio < 0.2;
    isWarning = isSuccessful && !isDanger && finalRatio < 0.4;
  } else {
    isDanger = !isSuccessful && result.results.successRate < 0.8;
    isWarning = !isSuccessful && !isDanger && result.results.successRate < 0.95;
  }

  let oneSimulationMsg;
  if (!isSuccessful) {
    oneSimulationMsg = 'No';
  } else if (isDanger) {
    oneSimulationMsg = 'Yes, barely';
  } else if (isWarning) {
    oneSimulationMsg = 'Yes, barely';
  } else {
    oneSimulationMsg = 'Yes';
  }

  const portfolioChartData = useMemo(
    () => {
      return formatCycleForPortfolioChart(firstCycle);
    },
    [firstCycle]
  );

  const spendingChartData = useMemo(
    () => {
      return formatCycleForSpendingChart(firstCycle);
    },
    [firstCycle]
  );

  return (
    <div className="results">
      <h1 className="results_title">Results</h1>
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
              {result.results.allCycles[0].duration} years
            </div>
          </div>
        )}
        <div className="results_section">
          <div className="results_sectionTitle">
            {!oneSimulation ? 'Success Rate' : 'Succeeded?'}
          </div>
          <div
            className={classnames('results_bigValue', {
              'results_bigValue-success': isSuccessful,
              'results_bigValue-warning': isWarning,
              'results_bigValue-danger': isDanger,
            })}>
            {!oneSimulation && result.successRate}
            {oneSimulation && oneSimulationMsg}
          </div>
        </div>
        {oneSimulation && (
          <>
            {Boolean(lowestDippedValue) && (
              <div className="results_section">
                <div className="results_sectionTitle">Lowest Value</div>
                <div className="results_value">
                  ${formatNumber(lowestDippedValue.value)}
                  {/* (
                  {(
                    (lowestDippedValue.value / result.initialPortfolioValue) *
                    100
                  ).toFixed(2)}
                  %) */}
                </div>
                <div className="results_details">
                  This value occurred in the year {lowestDippedValue.year}.
                </div>
              </div>
            )}
            {isSuccessful && (
              <div className="results_section">
                <div className="results_sectionTitle">Final Value</div>
                <div className="results_value">
                  ${formatNumber(firstCycle.finalValue)}
                  {/* (
                  {(
                    (firstCycle.finalValue / result.initialPortfolioValue) *
                    100
                  ).toFixed(2)}
                  %) */}
                </div>
                <div className="results_details">
                  The initial portfolio value was $
                  {formatNumber(result.initialPortfolioValue)}.
                </div>
              </div>
            )}
            {!isSuccessful && (
              <div className="results_section">
                <div className="results_sectionTitle">Year Failed</div>
                <div className="results_bigValue">{firstCycle.yearFailed}</div>
                <div className="results_details">
                  This portfolio survived for{' '}
                  {firstCycle.numberOfSuccessfulYears} years before running out
                  of money.
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {!oneSimulation && (
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
      )}
      {oneSimulation && (
        <>
          <div className="results_plotSection">
            <div className="results_sectionTitle">
              Portfolio Value Over Time
            </div>
            <Chart data={portfolioChartData} />
          </div>
          <div className="results_plotSection">
            <div className="results_sectionTitle">
              Spending Amount Over Time
            </div>
            <Chart data={spendingChartData} />
          </div>
        </>
      )}
    </div>
  );
}
