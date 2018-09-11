import React, { Component, createRef, Fragment } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import DialogForm from './dialog-form';

export default class LengthOfRetirementValue extends Component {
  render() {
    const { durationMode, numberOfYears, startYear, endYear } = this.props;
    const { isDialogOpen } = this.state;

    let yearsToDisplay;
    if (durationMode === 'historicalData') {
      yearsToDisplay = numberOfYears;
    } else {
      yearsToDisplay = Number(endYear) - Number(startYear);
    }

    return (
      <div className="displayValue_container">
        <div
          className="displayValue_pill"
          ref={this.valueRef}
          onClick={() => this.setState({ isDialogOpen: true })}>
          <span className="displayValue_pillValue">
            <span role="img" aria-label="Clock" className="displayValue_emoji">
              🕒
            </span>{' '}
            {yearsToDisplay}
          </span>{' '}
          <span className="displayValue_pillUnit"> years</span>
          <div className="displayValue_detailContainer">
            <span className="displayValue_pillDetail">
              {durationMode === 'historicalData' && 'Using historical data'}
              {durationMode === 'specificYears' && (
                <Fragment>
                  From <b>{startYear}</b> to <b>{endYear}</b>
                </Fragment>
              )}
            </span>
          </div>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={() => {
            this.setState({ isDialogOpen: false });
          }}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <DialogForm
              durationMode={durationMode}
              numberOfYears={numberOfYears}
              startYear={startYear}
              endYear={endYear}
              triggerRef={this.valueRef}
              onClose={() => this.setState({ isDialogOpen: false })}
              onConfirm={this.onConfirm}
            />
          )}
        </TransitionGroupPlus>
      </div>
    );
  }

  valueRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onConfirm = updates => {
    this.props.updateValues(updates);

    this.setState({ isDialogOpen: false });
  };
}
