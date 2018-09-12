import React, { Component, createRef, Fragment } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import DialogForm from './dialog-form';
import formatDollars from '../../utils/numbers/format-dollars';

export default class SpendingPlanValue extends Component {
  render() {
    const {
      firstYearWithdrawal,
      inflationAdjustedFirstYearWithdrawal,
    } = this.props;
    const { isDialogOpen } = this.state;

    return (
      <div className="displayValue_container">
        <div
          tabIndex="0"
          className="displayValue_pill"
          ref={this.valueRef}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              this.setState({ isDialogOpen: true });
            }
          }}
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span
            role="img"
            aria-label="Shopping Bags"
            className="displayValue_emoji displayValue_pillValue">
            🛍
          </span>{' '}
          <span className="displayValue_entry">
            <span className="displayValue_pillValue">
              {formatDollars(firstYearWithdrawal)}
            </span>{' '}
            <span className="displayValue_pillUnit">/ year</span>
          </span>
          <div className="displayValue_detailContainer">
            <span className="displayValue_pillDetail">
              {inflationAdjustedFirstYearWithdrawal && 'Adjusted for inflation'}
              {!inflationAdjustedFirstYearWithdrawal && (
                <Fragment>
                  <b>Not</b> adjusted for inflation
                </Fragment>
              )}
            </span>
          </div>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={() => this.setState({ isDialogOpen: false })}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <DialogForm
              firstYearWithdrawal={firstYearWithdrawal}
              inflationAdjustedFirstYearWithdrawal={
                inflationAdjustedFirstYearWithdrawal
              }
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
