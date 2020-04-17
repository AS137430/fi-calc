import React, { useMemo } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import classnames from 'classnames';
import IconGetApp from 'materialish/icon-get-app';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import Chart from './chart';
import useWithdrawalPlan from '../state/withdrawal-plan';
import formatNumber from '../utils/numbers/format-number';
import useSimulationResult from '../state/simulation-result';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import arrayToCsvDataURL from '../utils/array-to-csv-data-url';
import downloadDataURL from '../utils/download-data-url';

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

  const { state: withdrawalPlan } = useWithdrawalPlan();
  const portfolioChartData = useMemo(
    () => {
      return formatSimulationForPortfolioChart(simulation);
    },
    [simulation]
  );

  const withdrawalChartData = useMemo(
    () => {
      return formatSimulationForSpendingChart(simulation);
    },
    [simulation]
  );

  const csvUrl = useMemo(
    () => {
      if (!simulation) {
        return null;
      }

      const csvArray = simulation.resultsByYear.reduce(
        (arr, result, index) => {
          arr.push([
            result.year,
            portfolioChartData[index].value,
            withdrawalChartData[index].value,
          ]);

          return arr;
        },
        [['Year', 'Portfolio Value', 'Withdrawal Amount']]
      );

      return arrayToCsvDataURL(csvArray);
    },
    [portfolioChartData, simulation, withdrawalChartData]
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

  const isconstantWithdrawal =
    withdrawalPlan.withdrawalStrategy.key === 'constantWithdrawal';

  return (
    <div className="results">
      <div className="results_block">
        <Link to={!isSmallScreen ? '/' : '/results'} className="results_goBack">
          <IconKeyboardArrowLeft size="1.5rem" />
          Return to Results
        </Link>
        <div className="simulationHeader">
          <h1 className="simulationHeader_h1">
            Simulation: {simulation.startYear} – {simulation.endYear}
          </h1>
          <div className="simulationHeader_ctas">
            <button
              type="button"
              className="button button-primary simulation_downloadCsvBtn"
              onClick={() =>
                downloadDataURL(
                  csvUrl,
                  `single_sim-start_year_${simulation.startYear}`
                )
              }>
              <IconGetApp />
              Download as CSV
            </button>
          </div>
        </div>
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
        <h2 className="results_h2">Withdrawals</h2>
        {!isconstantWithdrawal && (
          <div className="results_sectionRow">
            <div className="results_section">
              <div className="results_sectionTitle">Lowest Withdrawal</div>
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
              <div className="results_sectionTitle">Final Year Withdrawal</div>
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
          <Chart data={withdrawalChartData} />
        </div>
      </div>
    </div>
  );
}
