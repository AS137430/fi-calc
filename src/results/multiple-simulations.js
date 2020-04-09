import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './results.css';
import GaussianPlot from './gaussian-plot';
import formatNumber from '../utils/numbers/format-number';

export default function MultipleSimulations({ result }) {
  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  const isSuccessful = result.summary === 'SUCCESSFUL';

  let isWarning = false;
  let isDanger = false;

  const { lowestDippedValue } = result;
  const firstCycle = result.results.allCycles[0];

  const finalRatio = firstCycle.finalValue / result.initialPortfolioValue;

  if (oneSimulation) {
    isDanger = !isSuccessful || finalRatio < 0.2;
    isWarning = isSuccessful && !isDanger && finalRatio < 0.4;
  } else {
    isDanger = !isSuccessful && result.results.successRate < 0.8;
    isWarning = !isSuccessful && !isDanger && result.results.successRate < 0.95;
  }

  return (
    <>
      <div>
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
