import React from 'react';
import classnames from 'classnames';
import IconInfoOutline from 'materialish/icon-info-outline';

export default function MultipleOverview({ result, updateStartYear }) {
  const isSuccessful = result.summary === 'SUCCESSFUL';

  const isDanger = !isSuccessful && result.results.successRate < 0.8;
  const isWarning =
    !isSuccessful && !isDanger && result.results.successRate < 0.95;

  return (
    <>
      <div className="results_block">
        <h2 className="results_h2">Results</h2>
        <div className="results_sectionRow">
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div className="results_bigValue">
              {result.results.numberOfCycles}
            </div>
          </div>
          <div className="results_section">
            <div className="results_sectionTitle">Success Rate</div>
            <div
              className={classnames('results_bigValue', {
                'results_bigValue-success': isSuccessful,
                'results_bigValue-warning': isWarning,
                'results_bigValue-danger': isDanger,
              })}>
              {result.successRate}
            </div>
          </div>
        </div>
        {/* <h2 className="results_h2">Overview</h2>
        <div className="results_plotSection">
          <GaussianPlot
            gaussian={result.results.gaussian}
            mean={result.results.mean}
            standardDeviation={result.results.standardDeviation}
          />
        </div> */}
      </div>
      <div className="results_block">
        <h2 className="results_h2">Simulations By Start Year</h2>
        <div className="tip">
          <IconInfoOutline />
          Click on a start year to view more information about that simulation.
        </div>
        <div className="results_byYearGrid">
          {result.results.allCycles.map(cycle => {
            return (
              <div
                onClick={() => updateStartYear(cycle.startYear)}
                className={classnames('byYear_cell', {
                  'byYear_cell-isWarning': cycle.status === 'WARNING',
                  'byYear_cell-isFailed': cycle.status === 'FAILED',
                  'byYear_cell-incomplete': !cycle.isComplete,
                })}
                key={cycle.startYear}>
                {cycle.startYear}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
