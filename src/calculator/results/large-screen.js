import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './large-screen.css';
import getStartYears from '../compute-result/get-start-years';

export default class LargeScreenResults extends Component {
  render() {
    const { successRate, result, inputs } = this.props;

    const numericSuccessRate = _.get(result, 'results.successRate', 0);
    const isGoodResult = numericSuccessRate >= 0.95;

    let numberOfSimulations;
    if (inputs.durationMode === 'historicalData') {
      numberOfSimulations = _.size(getStartYears(Number(inputs.numberOfYears)));
    } else {
      numberOfSimulations = 1;
    }

    return (
      <div className="largeScreenResults">
        <div className="largeScreenResults_summary">
          {numberOfSimulations > 1 && (
            <Fragment>
              <div>This calculation succeeded</div>
              <div
                className={classnames('calculator_resultsPercentage', {
                  'calculator_resultsPercentage-goodResult': isGoodResult,
                })}>
                {successRate}
              </div>
              <div>of the time.</div>
            </Fragment>
          )}
          {numberOfSimulations === 1 &&
            numericSuccessRate === 1 && (
              <Fragment>
                <div>This calculation</div>
                <div className="calculator_resultsPercentage calculator_resultsPercentage-goodResult">
                  Succeeded
                </div>
              </Fragment>
            )}
        </div>
        <button className="calculator_viewResultsBtn" type="button">
          View Details
        </button>
      </div>
    );
  }
}
