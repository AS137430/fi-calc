import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './results.css';
import GaussianPlot from './gaussian-plot';

export default function MultipleSimulations({ result }) {
  const isSuccessful = result.summary === 'SUCCESSFUL';

  const isDanger = !isSuccessful && result.results.successRate < 0.8;
  const isWarning =
    !isSuccessful && !isDanger && result.results.successRate < 0.95;

  return (
    <>
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
      <div className="results_plotSection">
        <div className="results_sectionTitle">
          Distribution of End Portfolio Value
        </div>
        <GaussianPlot
          gaussian={result.results.gaussian}
          mean={result.results.mean}
          standardDeviation={result.results.standardDeviation}
        />
      </div>
    </>
  );
}
