import React, { useMemo } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
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

export default function OneCycle({ inputs, isSuccessful, cycle, goBack }) {
  const lastYear = cycle.resultsByYear[cycle.resultsByYear.length - 1];

  const finalRatio =
    lastYear.computedData.portfolio.totalValueInFirstYearDollars /
    cycle.initialPortfolioValue;

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

  const isConstantSpending =
    inputs.spendingPlan.spendingStrategy.key === 'constantSpending';

  return (
    <>
      <div className="results_block">
        {goBack && (
          <div className="results_goBack" onClick={goBack}>
            <IconKeyboardArrowLeft size="1.5rem" />
            Return to Simulations Results
          </div>
        )}
        <h2 className="results_h2">
          {goBack && <>Year Overview</>}
          {!goBack && <>Simulation Overview</>}
        </h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Length of Simulation</div>
            <div className="results_bigValue">{cycle.duration} years</div>
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
          {isSuccessful && (
            <>
              <div className="results_section">
                <div className="results_sectionTitle">Lowest Value</div>
                <div className="results_value">
                  $
                  {formatNumber(
                    cycle.minPortfolioYearInFirstYearDollars.computedData
                      .portfolio.totalValueInFirstYearDollars
                  )}
                  <span className="results_secondaryValue">
                    ({cycle.minPortfolioYearInFirstYearDollars.year})
                  </span>
                </div>
              </div>
              <div className="results_section">
                <div className="results_sectionTitle">Final Value</div>
                <div className="results_value">
                  $
                  {formatNumber(
                    lastYear.computedData.portfolio.totalValueInFirstYearDollars
                  )}
                </div>
              </div>
            </>
          )}
          {!isSuccessful && (
            <div className="results_section">
              <div className="results_sectionTitle">Lasted Until</div>
              <div className="results_bigValue">{cycle.yearFailed}</div>
              <div className="results_details">
                This simulation ran for {cycle.numberOfSuccessfulYears} years
                before running out of money.
              </div>
            </div>
          )}
        </div>
        <div className="results_plotSection">
          <Chart data={portfolioChartData} />
        </div>
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
