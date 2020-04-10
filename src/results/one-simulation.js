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
  const isSuccessful = result.summary === 'SUCCESSFUL';
  const cycle = result.results.allCycles[0];
  const lastYear = cycle.resultsByYear[cycle.resultsByYear.length - 1];

  const finalRatio =
    lastYear.computedData.portfolio.totalValueInFirstYearDollars /
    result.initialPortfolioValue;

  const isDanger = !isSuccessful || finalRatio < 0.15;
  const isWarning = isSuccessful && !isDanger && finalRatio < 0.35;

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

  console.log('hello', spendingChartData);

  const isConstantSpending =
    result.inputs.spendingPlan.spendingStrategy.key === 'constantSpending';

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
                cycle.minPortfolioYearInFirstYearDollars.computedData.portfolio
                  .totalValueInFirstYearDollars
              )}
              <span className="results_secondaryValue">
                ({cycle.minPortfolioYearInFirstYearDollars.year})
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
        {!isConstantSpending && (
          <div className="results_sectionRow">
            <div className="results_section">
              <div className="results_sectionTitle">Lowest Spend</div>
              <div className="results_value">
                $
                {formatNumber(
                  cycle.minWithdrawalYearInFirstYearDollars.computedData
                    .totalWithdrawalAmountInFirstYearDollars
                )}
                <span className="results_secondaryValue">
                  ({cycle.minWithdrawalYearInFirstYearDollars.year})
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
        )}
        <div className="results_plotSection">
          <Chart data={spendingChartData} />
        </div>
      </div>
    </>
  );
}
