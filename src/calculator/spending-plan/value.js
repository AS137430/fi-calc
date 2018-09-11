import React, { Component, createRef } from 'react';
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
          className="displayValue_pill displayValue_pill-withDetail"
          ref={this.valueRef}
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span className="displayValue_pillValue">
            <span
              role="img"
              aria-label="Shopping Bags"
              className="displayValue_emoji">
              🛍
            </span>{' '}
            {formatDollars(firstYearWithdrawal)}
          </span>{' '}
          <span className="displayValue_pillUnit">/ year</span>
          <div className="displayValue_detailContainer">
            <span className="displayValue_pillDetail">
              {inflationAdjustedFirstYearWithdrawal && 'Adjusted for inflation'}
              {!inflationAdjustedFirstYearWithdrawal &&
                'Not adjusted for inflation'}
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
