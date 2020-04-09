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
      value: yearData.computedData.portfolio.totalValueInFirstYearDollars,
    };
  });
}

function formatCycleForSpendingChart(cycle) {
  return cycle?.resultsByYear?.map(yearData => {
    return {
      historyKey: `${yearData.year}-01`,
      month: 1,
      year: yearData.year,
      value: yearData.computedData.totalWithdrawalAmountInFirstYearDollars,
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
  const cycle = result.results.allCycles[0];
  const lastYear = cycle.resultsByYear[cycle.resultsByYear.length - 1];

  const finalRatio = cycle.finalValue / result.initialPortfolioValue;

  console.log('result', cycle, cycle.minPortfolioYear);

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
      return formatCycleForPortfolioChart(cycle);
    },
    [cycle]
  );

  const spendingChartData = useMemo(
    () => {
      return formatCycleForSpendingChart(cycle);
    },
    [cycle]
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
          <div className="results_section">
            <div className="results_sectionTitle">Lowest Value</div>
            <div className="results_value">
              $
              {formatNumber(
                cycle.minPortfolioYear.computedData.portfolio
                  .totalValueInFirstYearDollars
              )}
              <span className="results_secondaryValue">
                ({cycle.minPortfolioYear.year})
              </span>
            </div>
          </div>
          {isSuccessful && (
            <div className="results_section">
              <div className="results_sectionTitle">Final Value</div>
              <div className="results_value">
                $
                {formatNumber(
                  lastYear.computedData.portfolio.totalValueInFirstYearDollars
                )}
              </div>
            </div>
          )}
        </div>
        <div className="results_plotSection">
          <Chart data={portfolioChartData} />
        </div>
        {!isSuccessful && (
          <div className="results_section">
            <div className="results_sectionTitle">Year Failed</div>
            <div className="results_bigValue">{cycle.yearFailed}</div>
            <div className="results_details">
              This portfolio survived for {cycle.numberOfSuccessfulYears} years
              before running out of money.
            </div>
          </div>
        )}
        <div />
      </div>
      <div className="results_block">
        <h2 className="results_h2">Spending</h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Lowest Spend</div>
            <div className="results_value">
              $
              {formatNumber(
                cycle.minWithdrawalYear.computedData
                  .totalWithdrawalAmountInFirstYearDollars
              )}
              <span className="results_secondaryValue">
                ({cycle.minWithdrawalYear.year})
              </span>
            </div>
          </div>
          <div className="results_section">
            <div className="results_sectionTitle">Final Year Spend</div>
            <div className="results_value">
              $
              {formatNumber(
                lastYear.computedData.totalWithdrawalAmountInFirstYearDollars
              )}
            </div>
          </div>
        </div>
        <div className="results_plotSection">
          <Chart data={spendingChartData} />
        </div>
      </div>
    </>
  );
}
