import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import IconGetApp from 'materialish/icon-get-app';
import './results.css';
import IconInfoOutline from 'materialish/icon-info-outline';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import useSimulationResult from '../state/simulation-result';
import arrayToCsvDataURL from '../utils/array-to-csv-data-url';
import downloadDataURL from '../utils/download-data-url';
import simulationToCsv, {
  simulationCsvHeader,
} from '../utils/simulation-to-csv';

export default function SimulationsOverview() {
  const { result, inputs } = useSimulationResult();

  console.log('hi', inputs);

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

  const exceedsSuccessRateThreshold = result?.exceedsSuccessRateThreshold;

  const isDanger = !exceedsSuccessRateThreshold && result?.successRate < 0.8;
  const isWarning =
    !exceedsSuccessRateThreshold && !isDanger && result?.successRate < 0.95;

  const hasResult = Boolean(result);
  const hasSimulations = Boolean(result?.completeSimulations.length);

  const numberOfSims = hasSimulations ? result?.completeSimulations.length : 0;
  const numberOfSimsAlert =
    hasResult && numberOfSims <= 10 && numberOfSims !== 0;

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
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-loading': !hasResult,
                'results_bigValue-danger': numberOfSimsAlert,
              })}>
              {!hasResult && <>-</>}
              {hasResult && <>{result?.completeSimulations.length}</>}
            </div>
          </div>
          {hasSimulations && (
            <div className="results_section">
              <div className="results_sectionTitle">Success Rate</div>
              <div
                className={classnames('results_bigValue', {
                  'results_bigValue-success': exceedsSuccessRateThreshold,
                  'results_bigValue-warning': isWarning,
                  'results_bigValue-danger': isDanger,
                })}>
                {result?.successRateDisplay}
              </div>
            </div>
          )}
        </div>
      </div>
      {hasSimulations && (
        <div className="results_block">
          <h2 className="results_h2">Simulations By Start Year</h2>
          <div className="results_help">
            Click on a year to view more information about that simulation.
          </div>
          <div className="results_byYearGrid">
            {result.completeSimulations.map(simulation => {
              return (
                <Link
                  to={`/calculator/year/${simulation.startYear}`}
                  className={classnames('byYear_cell', {
                    'byYear_cell-isWarning': simulation.status === 'WARNING',
                    'byYear_cell-isFailed': simulation.status === 'FAILED',
                    'byYear_cell-incomplete': !simulation.isComplete,
                  })}
                  key={simulation.startYear}>
                  {simulation.startYear}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
