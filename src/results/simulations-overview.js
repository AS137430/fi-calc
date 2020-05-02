import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import IconGetApp from 'materialish/icon-get-app';
import { clamp } from '../vendor/@moolah/lib';
import './results.css';
import IconInfoOutline from 'materialish/icon-info-outline';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import useSimulationResult from '../state/simulation-result';
import arrayToCsvDataURL from '../utils/csv-export/array-to-csv-data-url';
import downloadDataURL from '../utils/csv-export/download-data-url';
import getYearRange from '../vendor/computed-market-data/get-year-range';
import simulationToCsv, {
  simulationCsvHeader,
} from '../utils/csv-export/simulation-to-csv';

function numberOfResults({
  lengthOfRetirement,
  useAllHistoricalData,
  firstYear,
  lastYear,
}) {
  const { minYear, maxYear } = getYearRange();

  if (useAllHistoricalData) {
    const calculatedMaxYear = maxYear - lengthOfRetirement;
    return Math.max(0, calculatedMaxYear - minYear + 1);
  } else {
    const clampedFirstYear = clamp(firstYear, minYear, maxYear);
    const clampedLastYear = clamp(lastYear, minYear, maxYear);

    const calculatedMaxYear = clampedLastYear - lengthOfRetirement;

    return Math.max(0, calculatedMaxYear - clampedFirstYear + 1);
  }
}

export default function SimulationsOverview() {
  const { result, inputs, status } = useSimulationResult();

  const isSmallScreen = useIsSmallScreen();

  // For debugging purposes
  window.result = result;

  const csvUrl = useMemo(
    () => {
      if (!result) {
        return null;
      }

      const csvArray = result.completeSimulations.flatMap(
        (simulation, zeroIndexedSimulationNumber) => {
          return simulationToCsv(simulation, zeroIndexedSimulationNumber + 1);
        }
      );

      return arrayToCsvDataURL([simulationCsvHeader, ...csvArray]);
    },
    [result]
  );

  const hasResult = Boolean(result);
  const hasSimulations = Boolean(result?.completeSimulations.length);

  const numberOfSims = hasSimulations ? result?.completeSimulations.length : 0;
  const numberOfSimsAlert =
    hasResult && numberOfSims <= 10 && numberOfSims !== 0;

  const expectedResults = Array.from({
    length: numberOfResults({
      lengthOfRetirement: inputs.lengthOfRetirement.numberOfYears,
      useAllHistoricalData: inputs.historicalDataRange.useAllHistoricalData,
      firstYear: inputs.historicalDataRange.firstYear,
      lastYear: inputs.historicalDataRange.lastYear,
    }),
  });

  const isLoading = status === 'COMPUTING' || status === 'IDLE';

  const hasExpectedResults = Boolean(expectedResults.length);

  if (process.env.NODE_ENV !== 'production') {
    if (!isLoading) {
      if (result?.completeSimulations.length !== expectedResults.length) {
        console.error(
          '[Load error]: The results displayed will be incomplete.'
        );
      }
    }
  }

  return (
    <div className="results">
      <div className="results_block">
        {isSmallScreen && (
          <Link to="/calculator" className="results_goBack">
            <IconKeyboardArrowLeft size="1.5rem" />
            Return to Configuration
          </Link>
        )}
        <div className="simulationHeader">
          <h1 className="simulationHeader_h1">Results</h1>
          <div className="simulationHeader_ctas">
            {hasSimulations && (
              <button
                type="button"
                disabled={isLoading}
                className="button button-secondary simulation_downloadCsvBtn"
                onClick={() => downloadDataURL(csvUrl, `sim_data.csv`)}>
                <IconGetApp />
                Download as CSV
              </button>
            )}
          </div>
        </div>
        {hasResult &&
          !hasSimulations && (
            <div className="results_block">
              <div className="tip">
                <IconInfoOutline size="1.05rem" />
                <div className="tip_msg">
                  No simulations were run because your length of retirement is
                  too long. Specify a shorter retirement length to see results.
                </div>
              </div>
            </div>
          )}
        {hasResult &&
          numberOfSimsAlert && (
            <div className="results_block">
              <div className="tip tip-danger">
                <IconInfoOutline size="1.05rem" />
                <div className="tip_msg">
                  A very small number of simulations were run in this
                  calculation. Results are more useful with more simulations.
                  Reduce the length of your retirement to run more simulations.
                </div>
              </div>
            </div>
          )}
        <div
          className={classnames('results_sectionRow', {
            'results_sectionRow-isLoading': isLoading,
          })}>
          <div
            className={classnames('results_section', {
              'results_section-isLoading': isLoading,
            })}>
            <div className="results_sectionTitle">Number of Simulations</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-danger': numberOfSimsAlert,
              })}>
              {!hasResult && <>&nbsp;</>}
              {hasResult && <>{result?.completeSimulations.length}</>}
            </div>
          </div>
          {result?.analysis.successRate.display.overview.map((item, index) => {
            return (
              <div
                key={index}
                className={classnames('results_section', {
                  'results_section-isLoading': isLoading,
                })}>
                <div className="results_sectionTitle">{item.title}</div>
                <div
                  className={classnames('results_bigValue', {
                    'results_bigValue-success':
                      item.exceedsSuccessRateThreshold,
                    'results_bigValue-warning': item.isWarning,
                    'results_bigValue-danger': item.isDanger,
                  })}>
                  {item.display}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {hasExpectedResults && (
        <div
          className={classnames('results_block', {
            'results_block-isLoading': isLoading,
          })}>
          <h2 className="results_h2">Simulations By Start Year</h2>
          <div className="results_help">
            Click on a year to view more information about that simulation.
          </div>
          <div className="results_byYearGrid">
            {expectedResults.map((number, index) => {
              const simulation = result?.completeSimulations[index];
              // TODO: this cannot be tied to a single analysis.
              // It must be standalone.
              const simBlockColor =
                result?.analysis.successRate.simBlockColor[index];

              let classNames;
              if (isLoading) {
                classNames = 'byYear_cell byYear_cell-placeholder';
              } else {
                classNames = classnames('byYear_cell', {
                  'byYear_cell-isWarning': simBlockColor === 'orange',
                  'byYear_cell-isFailed': simBlockColor === 'red',
                });
              }

              return (
                <Link
                  to={`/calculator/year/${simulation?.startYear}`}
                  className={classNames}
                  key={index}>
                  {simulation && simulation.startYear}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
