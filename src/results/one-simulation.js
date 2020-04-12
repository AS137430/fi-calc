import React, { useMemo } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import classnames from 'classnames';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import Chart from './chart';
import useSpendingPlan from '../state/spending-plan';
import formatNumber from '../utils/numbers/format-number';
import useSimulationResult from '../state/simulation-result';
import useIsSmallScreen from '../hooks/use-is-small-screen';

function formatSimulationForPortfolioChart(simulation) {
  return simulation?.resultsByYear?.map(yearData => {
    return {
      historyKey: `${yearData.year}-01`,
      month: 1,
      year: yearData.year,
      value: yearData.computedData.portfolio.totalValueInFirstYearDollars,
    };
  });
}

function formatSimulationForSpendingChart(simulation) {
  return simulation?.resultsByYear?.map(yearData => {
    return {
      historyKey: `${yearData.year}-01`,
      month: 1,
      year: yearData.year,
      value: yearData.computedData.totalWithdrawalAmountInFirstYearDollars,
    };
  });
}

export default function OneSimulation() {
  const isSmallScreen = useIsSmallScreen();
  const { year } = useParams();
  const { result } = useSimulationResult();
  const numericYear = Number(year);

  const simulation = useMemo(
    () => {
      if (!result || Number.isNaN(numericYear)) {
        return null;
      }

      return _.find(result.completeSimulations, {
        startYear: numericYear,
      });
    },
    [result, numericYear]
  );

  const { state: spendingPlan } = useSpendingPlan();
  const portfolioChartData = useMemo(
    () => {
      return formatSimulationForPortfolioChart(simulation);
    },
    [simulation]
  );

  const spendingChartData = useMemo(
    () => {
      return formatSimulationForSpendingChart(simulation);
    },
    [simulation]
  );

  if (!simulation) {
    return null;
  }

  const lastYear =
    simulation.resultsByYear[simulation.resultsByYear.length - 1];

  const isSuccess = simulation.status === 'OK';
  const isFailed = simulation.status === 'FAILED';
  const isWarning = simulation.status === 'WARNING';

  let successMessage;
  if (isFailed) {
    successMessage = 'No';
  } else if (isWarning) {
    successMessage = 'Yes, but not much';
  } else {
    successMessage = 'Yes';
  }

  const isConstantSpending =
    spendingPlan.spendingStrategy.key === 'constantSpending';

  return (
    <div className="results">
      <div className="results_block">
        <Link to={!isSmallScreen ? '/' : '/results'} className="results_goBack">
          <IconKeyboardArrowLeft size="1.5rem" />
          Return to Results
        </Link>
        <h2 className="results_h2">
          <>
            Simulation: {simulation.startYear} – {simulation.endYear}
          </>
        </h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">
              Has money remaining at end?
            </div>
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
                    simulation.minPortfolioYearInFirstYearDollars.computedData
                      .portfolio.totalValueInFirstYearDollars
                  )}
                  <span className="results_secondaryValue">
                    ({simulation.minPortfolioYearInFirstYearDollars.year})
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
              <div className="results_bigValue">{simulation.yearFailed}</div>
              <div className="results_details">
                This simulation ran for {simulation.numberOfSuccessfulYears}{' '}
                years before running out of money.
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
                  simulation.minWithdrawalYearInFirstYearDollars.computedData
                    .totalWithdrawalAmountInFirstYearDollars
                )}
                <span className="results_secondaryValue">
                  ({simulation.minWithdrawalYearInFirstYearDollars.year})
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
    </div>
  );
}
