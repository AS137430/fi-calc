import React, { Component, Fragment, createRef } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import './large-screen.css';
import ResultsDialog from './results-dialog';
import getStartYears from '../compute-result/get-start-years';

export default class LargeScreenResults extends Component {
  render() {
    const { successRate, result, inputs } = this.props;
    const { isDialogOpen } = this.state;

    const numericSuccessRate = _.get(result, 'results.successRate', 0);
    const isGoodResult = numericSuccessRate >= 0.95;

    let numberOfSimulations;
    if (inputs.durationMode === 'historicalData') {
      numberOfSimulations = _.size(getStartYears(Number(inputs.numberOfYears)));
    } else {
      numberOfSimulations = 1;
    }

    return (
      <Fragment>
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
          <button
            ref={this.viewMoreBtnRef}
            className="largeScreenResults_viewMoreButton button"
            onClick={() => {
              this.setState({ isDialogOpen: true });
            }}
            type="button">
            View Details
          </button>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={this.onClickOverlay}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <ResultsDialog
              inputs={inputs}
              result={result}
              triggerRef={this.viewMoreBtnRef}
              onClose={() => this.setState({ isDialogOpen: false })}
            />
          )}
        </TransitionGroupPlus>
      </Fragment>
    );
  }

  viewMoreBtnRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onClickOverlay = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ isDialogOpen: false });
  };
}
