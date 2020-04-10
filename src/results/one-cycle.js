import React, { useMemo } from 'react';
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

export default function OneCycle({ inputs, cycle, goBack }) {
  const lastYear = cycle.resultsByYear[cycle.resultsByYear.length - 1];

  const isSuccess = cycle.status === 'OK';
  const isFailed = cycle.status === 'FAILED';
  const isWarning = cycle.status === 'WARNING';

  let successMessage;
  if (isFailed) {
    successMessage = 'No';
  } else if (isWarning) {
    successMessage = 'Yes, barely';
  } else {
    successMessage = 'Yes';
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
          <button type="button" className="results_goBack" onClick={goBack}>
            <IconKeyboardArrowLeft size="1.5rem" />
            Return to Results
          </button>
        )}
        <h2 className="results_h2">
          {goBack && (
            <>
              Simulation: {cycle.startYear} – {cycle.endYear}
            </>
          )}
          {!goBack && <>Simulation Overview</>}
        </h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Succeeded?</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-success': isSuccess,
                'results_bigValue-warning': isWarning,
                'results_bigValue-danger': isFailed,
              })}>
              {successMessage}
            </div>
          </div>
        </div>
      </div>
      <div className="results_block">
        <h2 className="results_h2">Portfolio</h2>
        <div className="results_sectionRow">
          {!isFailed && (
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
          {isFailed && (
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
