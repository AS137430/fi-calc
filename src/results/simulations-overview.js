import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import IconGetApp from 'materialish/icon-get-app';
import './results.css';
import IconInfoOutline from 'materialish/icon-info-outline';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import { getItem, setItem } from '../utils/storage';
import useSimulationResult from '../state/simulation-result';
import arrayToCsvDataURL from '../utils/array-to-csv-data-url';
import downloadDataURL from '../utils/download-data-url';

const STORAGE_KEY = 'isViewYearDetailsHidden';

export default function SimulationsOverview() {
  const { result } = useSimulationResult();

  const isSmallScreen = useIsSmallScreen();
  const [isTipHidden, setIsTipHidden] = useState(() =>
    Boolean(getItem(STORAGE_KEY))
  );

  // For debugging purposes
  window.result = result;

  const csvUrl = useMemo(
    () => {
      if (!result) {
        return null;
      }

      const csvArray = result.completeSimulations.reduce(
        (arr, result) => {
          arr.push([
            result.startYear,
            result.endYear,
            result.duration,
            result.initialPortfolioValue,
            result.finalValue,
            result.isFailed,
            result.yearFailed,
            result.numberOfSuccessfulYears,
            result.status,
            result.totalInflationOverPeriod,
          ]);

          return arr;
        },
        [
          [
            'Start Year',
            'End Year',
            'Duration',
            'Initial Portfolio Value',
            'Final Portfolio Value',
            'Ran Out of Money?',
            'Year Failed',
            'Number of Successful Years',
            'Final Portfolio Value Status',
            'Inflation Over Period',
          ],
        ]
      );

      return arrayToCsvDataURL(csvArray);
    },
    [result]
  );

  if (!result) {
    return null;
  }

  const { exceedsSuccessRateThreshold } = result;

  const isDanger = !exceedsSuccessRateThreshold && result.successRate < 0.8;
  const isWarning =
    !exceedsSuccessRateThreshold && !isDanger && result.successRate < 0.95;

  function hideViewYearsDetails() {
    setIsTipHidden(true);
    // localStorage values are all strings, which is why we store this as the string "true"
    // rather than as a boolean.
    setItem(STORAGE_KEY, 'true');
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
            <button
              type="button"
              className="button button-secondary simulation_downloadCsvBtn"
              onClick={() => downloadDataURL(csvUrl, `sim_data.csv`)}>
              <IconGetApp />
              Download as CSV
            </button>
          </div>
        </div>

        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div className="results_bigValue">
              {result.completeSimulations.length}
            </div>
          </div>
          <div className="results_section">
            <div className="results_sectionTitle">Success Rate</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-success': exceedsSuccessRateThreshold,
                'results_bigValue-warning': isWarning,
                'results_bigValue-danger': isDanger,
              })}>
              {result.successRateDisplay}
            </div>
          </div>
        </div>
      </div>
      <div className="results_block">
        <h2 className="results_h2">Simulations By Start Year</h2>
        {!isTipHidden && (
          <div className="tip">
            <IconInfoOutline size="1.05rem" />
            <div className="tip_msg">
              Click on a year to view more information about that simulation.
            </div>
            <button
              className="tip_btn"
              type="button"
              onClick={hideViewYearsDetails}>
              Okay
            </button>
          </div>
        )}
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
    </div>
  );
}
