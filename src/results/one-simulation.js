import React, { useMemo } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './results.css';
import Chart from './chart';
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

export default function OneSimulation({ result }) {
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
    <>
      <div className="results_block">
        <h2 className="results_h2">Overview</h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Length of Simulation</div>
            <div className="results_bigValue">
              {result.results.allCycles[0].duration} years
            </div>
          </div>
          <div className="results_section">
            <div className="results_sectionTitle">Succeeded?</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-success': isSuccessful,
                'results_bigValue-warning': isWarning,
                'results_bigValue-danger': isDanger,
              })}>
              {oneSimulationMsg}
            </div>
          </div>
        </div>
      </div>
      <div className="results_block">
        <h2 className="results_h2">Portfolio</h2>
        <div className="results_sectionRow">
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
                <span className="results_secondaryValue">
                  ({lowestDippedValue.year})
                </span>
              </div>
              {/* <div className="results_details">
                This value occurred in the year .
              </div> */}
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
              {/* <div className="results_details">
                The initial portfolio value was $
                {formatNumber(result.initialPortfolioValue)}.
              </div> */}
            </div>
          )}
        </div>
        <div className="results_plotSection">
          <Chart data={portfolioChartData} />
        </div>
        {!isSuccessful && (
          <div className="results_section">
            <div className="results_sectionTitle">Year Failed</div>
            <div className="results_bigValue">{firstCycle.yearFailed}</div>
            <div className="results_details">
              This portfolio survived for {firstCycle.numberOfSuccessfulYears}{' '}
              years before running out of money.
            </div>
          </div>
        )}
        <div />
      </div>
      <div className="results_block">
        <h2 className="results_h2">Spending</h2>
        <div className="results_plotSection">
          <Chart data={spendingChartData} />
        </div>
      </div>
    </>
  );
}
