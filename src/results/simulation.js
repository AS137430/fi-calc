import React, { useMemo } from 'react';
import _ from 'lodash';
import { Link, useParams } from 'react-router-dom';
import classnames from 'classnames';
import IconGetApp from 'materialish/icon-get-app';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import Chart from '../vendor/chart/chart';
import useWithdrawalStrategy from '../state/withdrawal-strategy';
import formatForDisplay from '../utils/money/format-for-display';
import useSimulationResult from '../state/simulation-result';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import simulationToCsv, {
  simulationCsvHeader,
} from '../utils/simulation-to-csv';
import arrayToCsvDataURL from '../utils/array-to-csv-data-url';
import downloadDataURL from '../utils/download-data-url';
import dollarTicks from '../utils/chart/dollar-ticks';
import yearTicks from '../utils/chart/year-ticks';
import smallDisplay from '../utils/money/small-display';
import addYears from '../utils/date/add-years';

function formatSimulationForPortfolioChart(simulation) {
  if (!simulation) {
    return [];
  }

  const chartData = simulation.resultsByYear.map(yearData => {
    return {
      x: `${yearData.year + 1}.1`,
      y: yearData.computedData.portfolio.totalValueInFirstYearDollars,
    };
  });

  chartData.unshift({
    x: `${simulation.startYear}.1`,
    y: simulation.initialPortfolioValue,
  });

  return chartData;
}

function formatSimulationForWithdrawalChart(simulation) {
  return simulation?.resultsByYear?.map(yearData => {
    return {
      x: `${yearData.year}.1`,
      y: yearData.computedData.totalWithdrawalAmountInFirstYearDollars,
    };
  });
}

function yAxisLabelFromValue(value, isSmallScreen) {
  const useSmallDisplay = isSmallScreen;
  const useMediumDisplay = !isSmallScreen && value > 10000000;
  const useFullDisplay = !useSmallDisplay && !useMediumDisplay;

  const formatted = !useFullDisplay
    ? smallDisplay(value, 3, useMediumDisplay ? 'medium' : 'short')
    : formatForDisplay(value, { digits: 0 });

  if (typeof formatted === 'string') {
    return formatted;
  } else {
    return `${formatted.value < 0 ? formatted.prefix : ''}
      ${useMediumDisplay ? '$' : ''}
      ${formatted.value}
      ${useMediumDisplay ? ' ' : ''}
      ${formatted.magnitude}`;
  }
}

function xAxisLabelFromInfo(maxChartDataPoint, point) {
  const [stringYear, stringMonth] = maxChartDataPoint.x.split('.');

  const dateToUse = addYears(
    {
      month: Number(stringMonth),
      year: Number(stringYear),
    },
    point.distance
  );

  const isWideEnoughForMonth = point.width > 100;
  const monthString = isWideEnoughForMonth ? 'Jan ' : '';

  return `${monthString}${dateToUse.year}`;
}

export default function Simulation() {
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

  const { state: withdrawalStrategy } = useWithdrawalStrategy();
  const portfolioChartData = useMemo(
    () => {
      return formatSimulationForPortfolioChart(simulation);
    },
    [simulation]
  );

  const withdrawalChartData = useMemo(
    () => {
      return formatSimulationForWithdrawalChart(simulation);
    },
    [simulation]
  );

  const csvUrl = useMemo(
    () => {
      if (!simulation) {
        return null;
      }

      const csvArray = simulationToCsv(simulation, 1);
      return arrayToCsvDataURL([simulationCsvHeader, ...csvArray]);
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

  const isconstantWithdrawal =
    withdrawalStrategy.withdrawalStrategyName.key === 'constantWithdrawal';

  return (
    <div className="results">
      <div className="results_block">
        <Link
          to={!isSmallScreen ? '/calculator' : '/calculator/results'}
          className="results_goBack">
          <IconKeyboardArrowLeft size="1.5rem" />
          Return to Results
        </Link>
        <div className="simulationHeader">
          <h1 className="simulationHeader_h1">
            Jan&nbsp;
            {simulation.startYear} – Jan&nbsp;
            {simulation.endYear + 1}
          </h1>
          <div className="simulationHeader_ctas">
            <button
              type="button"
              className="button button-secondary simulation_downloadCsvBtn"
              onClick={() =>
                downloadDataURL(
                  csvUrl,
                  `single_sim-start_year_${simulation.startYear}.csv`
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
                  {formatForDisplay(
                    simulation.minPortfolioYearInFirstYearDollars.computedData
                      .portfolio.totalValueInFirstYearDollars
                  )}
                  <span className="results_secondaryValue">
                    ({simulation.minPortfolioYearInFirstYearDollars.year + 1})
                  </span>
                </div>
              </div>
              <div className="results_section">
                <div className="results_sectionTitle">Final Value</div>
                <div className="results_value">
                  {formatForDisplay(
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
          <Chart
            yAxisLabelFromValue={value =>
              yAxisLabelFromValue(value, isSmallScreen)
            }
            xAxisLabelFromInfo={xAxisLabelFromInfo}
            data={portfolioChartData}
            isSmallScreen={isSmallScreen}
            yTicks={dollarTicks}
            xTicks={yearTicks}
          />
        </div>
        <div />
      </div>
      <div className="results_block">
        <h2 className="results_h2">Withdrawals</h2>
        {!isconstantWithdrawal &&
          simulation.duration > 1 && (
            <div className="results_sectionRow">
              <div className="results_section">
                <div className="results_sectionTitle">Lowest Withdrawal</div>
                <div className="results_value">
                  {formatForDisplay(
                    simulation.minWithdrawalYearInFirstYearDollars.computedData
                      .totalWithdrawalAmountInFirstYearDollars
                  )}
                  <span className="results_secondaryValue">
                    ({simulation.minWithdrawalYearInFirstYearDollars.year})
                  </span>
                </div>
              </div>
              <div className="results_section">
                <div className="results_sectionTitle">
                  Final Year Withdrawal
                </div>
                <div className="results_value">
                  {formatForDisplay(
                    lastYear.computedData
                      .totalWithdrawalAmountInFirstYearDollars
                  )}
                </div>
              </div>
            </div>
          )}
        <div className="results_plotSection">
          <Chart
            yAxisLabelFromValue={point =>
              yAxisLabelFromValue(point, isSmallScreen)
            }
            xAxisLabelFromInfo={xAxisLabelFromInfo}
            data={withdrawalChartData}
            isSmallScreen={isSmallScreen}
            yTicks={dollarTicks}
            xTicks={yearTicks}
          />
        </div>
      </div>
    </div>
  );
}
