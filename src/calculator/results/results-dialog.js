import React, { Component, Fragment, createRef } from 'react';
import _ from 'lodash';
import IconDateRange from 'materialish/icon-date-range';
import IconTrendingDown from 'materialish/icon-trending-down';
import Dialog from '../dialog';
import getStartYears from '../compute-result/get-start-years';
import { morph } from '../../utils/animations';

export default class ResultsDialog extends Component {
  render() {
    const { onClose, result, inputs } = this.props;

    const dipCount = _.chain(result)
      .get('results.dippedCycles')
      .size()
      .value();

    let numberOfSimulations;
    if (inputs.durationMode === 'historicalData') {
      numberOfSimulations = _.size(getStartYears(Number(inputs.numberOfYears)));
    } else {
      numberOfSimulations = 1;
    }

    return (
      <Dialog
        className="resultsDialog"
        nodeRef={this.dialogRef}
        open={true}
        onEscPressed={e => {
          e.preventDefault();
          e.stopPropagation();

          onClose();
        }}>
        <h1 className="dialog_header">Detailed Results</h1>
        <div className="dialog_contents">
          <div className="results_segment">
            <div className="results_description">
              <IconDateRange className="results_descriptionIcon" />{' '}
              {numberOfSimulations > 1 && (
                <Fragment>
                  <b>{numberOfSimulations}</b> total simulations were run as
                  part of this calculation.
                </Fragment>
              )}
              {numberOfSimulations === 1 && (
                <Fragment>
                  <b>{numberOfSimulations}</b> simulation was run as part of
                  this calculation.
                </Fragment>
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
                <Fragment>
                  <IconTrendingDown className="results_descriptionIcon" /> There
                  were <b>{dipCount}</b> dips.
                </Fragment>
              )}
              {dipCount === 1 && (
                <Fragment>
                  <IconTrendingDown className="results_descriptionIcon" /> There
                  was <b>{dipCount}</b> dip.
                </Fragment>
              )}
            </div>
            <div className="results_moreInfo">
              A dip is when your portfolio drops below 90% of the value that it
              was at the start of your retirement.
            </div>
          </div>
        </div>
        <div className="dialog_footer">
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </Dialog>
    );
  }

  dialogRef = createRef();

  componentWillEnter = cb => {
    const animation = morph(200);
    animation.componentWillEnter(
      cb,
      this.dialogRef.current,
      this.props.triggerRef.current
    );
  };

  componentWillLeave = cb => {
    const animation = morph(200);

    animation.componentWillLeave(
      cb,
      this.dialogRef.current,
      this.props.triggerRef.current
    );
  };
}
