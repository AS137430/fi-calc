import React, { Component, createRef, Fragment } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import '../input.css';
import DialogForm from './dialog-form';

export default class DurationInput extends Component {
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
      <div className="input_container">
        <div
          className="input_pill input_pill-withDetail"
          ref={this.pillRef}
          onClick={() => this.setState({ isDialogOpen: true })}>
          <span className="input_pillValue">
            <span role="img" aria-label="Clock" className="input_emoji">
              🕒
            </span>{' '}
            {yearsToDisplay}
          </span>{' '}
          <span className="input_pillUnit"> years</span>
          <div className="input_detailContainer">
            <span className="input_pillDetail">
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
              triggerRef={this.pillRef}
              onClose={() => this.setState({ isDialogOpen: false })}
              onConfirm={this.onConfirm}
            />
          )}
        </TransitionGroupPlus>
      </div>
    );
  }

  pillRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onConfirm = updates => {
    this.props.updateValues(updates);

    this.setState({ isDialogOpen: false });
  };
}
