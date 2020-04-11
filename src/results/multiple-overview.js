import React from 'react';
import classnames from 'classnames';
import IconInfoOutline from 'materialish/icon-info-outline';
import IconKeyboardArrowLeft from 'materialish/icon-keyboard-arrow-left';

export default function MultipleOverview({
  result,
  updateStartYear,
  goToConfig,
}) {
  const { exceedsSuccessRateThreshold } = result;

  const isDanger = !exceedsSuccessRateThreshold && result.successRate < 0.8;
  const isWarning =
    !exceedsSuccessRateThreshold && !isDanger && result.successRate < 0.95;

  return (
    <>
      <div className="results_block">
        {typeof goToConfig === 'function' && (
          <button type="button" className="results_goBack" onClick={goToConfig}>
            <IconKeyboardArrowLeft size="1.5rem" />
            Return to Configuration
          </button>
        )}
        <h2 className="results_h2">Results</h2>
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
        <div className="tip">
          <IconInfoOutline size="1.05rem" />
          Click on a year to view more information about that simulation.
        </div>
        <div className="results_byYearGrid">
          {result.completeSimulations.map(cycle => {
            return (
              <button
                type="button"
                onClick={() => updateStartYear(cycle)}
                className={classnames('byYear_cell', {
                  'byYear_cell-isWarning': cycle.status === 'WARNING',
                  'byYear_cell-isFailed': cycle.status === 'FAILED',
                  'byYear_cell-incomplete': !cycle.isComplete,
                })}
                key={cycle.startYear}>
                {cycle.startYear}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
