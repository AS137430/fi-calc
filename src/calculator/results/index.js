import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import IconDateRange from 'materialish/icon-date-range';
import IconTrendingDown from 'materialish/icon-trending-down';
import './index.css';
import getStartYears from '../compute-result/get-start-years';

export default class Results extends Component {
  render() {
    const { successRate, result, inputs } = this.props;

    const dipCount = _.chain(result)
      .get('results.dippedCycles')
      .size()
      .value();

    const numericSuccessRate = _.get(result, 'results.successRate', 0);
    const isGoodResult = numericSuccessRate >= 0.95;

    let numberOfSimulations;
    if (inputs.durationMode === 'historicalData') {
      numberOfSimulations = _.size(getStartYears(Number(inputs.numberOfYears)));
    } else {
      numberOfSimulations = 1;
    }

    return (
      <>
        <div className="calculator_resultsText">
          {numberOfSimulations > 1 && (
            <>
              <div>This calculation succeeded</div>
              <div
                className={classnames('calculator_resultsPercentage', {
                  'calculator_resultsPercentage-goodResult': isGoodResult,
                })}>
                {successRate}
              </div>
              <div>of the time.</div>
            </>
          )}
          {numberOfSimulations === 1 &&
            numericSuccessRate === 1 && (
              <>
                <div>This calculation</div>
                <div className="calculator_resultsPercentage calculator_resultsPercentage-goodResult">
                  Succeeded
                </div>
              </>
            )}
          {numberOfSimulations === 1 &&
            numericSuccessRate !== 1 && (
              <>
                <div>This calculation</div>
                <div className="calculator_resultsPercentage">Failed</div>
              </>
            )}
        </div>
        <div className="results_segment">
          <div className="results_description">
            <IconDateRange className="results_descriptionIcon" />{' '}
            {numberOfSimulations > 1 && (
              <>
                <b>{numberOfSimulations}</b> total simulations were run as part
                of this calculation.
              </>
            )}
            {numberOfSimulations === 1 && (
              <>
                <b>{numberOfSimulations}</b> simulation was run as part of this
                calculation.
              </>
            )}
          </div>
          <div className="results_moreInfo">
            These results can be considered more reliable with a higher
            simulation count.
          </div>
        </div>
        <div className="results_segment">
          <div className="results_description">
            {dipCount !== 1 && (
              <>
                <IconTrendingDown className="results_descriptionIcon" /> There
                were <b>{dipCount}</b> dips.
              </>
            )}
            {dipCount === 1 && (
              <>
                <IconTrendingDown className="results_descriptionIcon" /> There
                was <b>{dipCount}</b> dip.
              </>
            )}
          </div>
          <div className="results_moreInfo">
            A dip is when your portfolio drops below 90% of the value that it
            was at the start of your retirement.
          </div>
        </div>
      </>
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.unregisterKeys();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      this.registerKeys();
    }
  }

  componentWillUnmount() {
    this.unregisterKeys();
  }

  registerKeys = () => {
    window.addEventListener('keydown', this.onKeyDown);
  };

  unregisterKeys = () => {
    window.removeEventListener('keydown', this.onKeyDown);
  };

  onKeyDown = e => {
    const { onClose } = this.props;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();

      onClose();
    }
  };
}
