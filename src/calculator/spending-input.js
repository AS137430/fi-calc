import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import './input.css';
import Dialog from './dialog';
import { morph } from '../utils/animations';
import maxDollarInput from '../utils/forms/max-dollar-input';

export default class DurationInput extends Component {
  render() {
    const { field, fieldName, updateValue } = this.props;
    const { isDialogOpen } = this.state;

    return (
      <div>
        <div
          className="input_pill"
          ref={this.pillRef}
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span className="input_pillValue">{field.value}</span>{' '}
          <span className="input_pillUnit">/ year</span>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={() => this.setState({ isDialogOpen: false })}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <Dialog
              componentWillEnter={this.onOpen}
              componentWillLeave={this.onClose}
              nodeRef={this.dialogRef}
              open={true}
              onEscPressed={e => {
                e.preventDefault();
                e.stopPropagation();

                this.setState({ isDialogOpen: false });
              }}>
              <h1 className="dialog_header">Spending</h1>
              <div className="dialog_contents">
                <input
                  value={field.value}
                  className={classnames('input calculator-input', {
                    input_error: field.error,
                  })}
                  type="number"
                  min="0"
                  max={maxDollarInput}
                  inputMode="numeric"
                  id="inflationAdjusted_firstYearWithdrawal"
                  onChange={event => updateValue(fieldName, event.target.value)}
                />
                {field.errorMsg && (
                  <div className="calculator-errorMsg">{field.errorMsg}</div>
                )}
              </div>
              <div className="dialog_footer">
                <button
                  className="button"
                  type="button"
                  onClick={() => this.setState({ isDialogOpen: false })}>
                  Cancel
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={this.onConfirmChanges}>
                  Save
                </button>
              </div>
            </Dialog>
          )}
        </TransitionGroupPlus>
      </div>
    );
  }

  pillRef = createRef();
  dialogRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onConfirmChanges = () => {
    this.setState({
      isDialogOpen: false,
    });
  };

  onOpen = cb => {
    const animation = morph(200);
    animation.componentWillEnter(
      cb,
      this.dialogRef.current,
      this.pillRef.current
    );
  };

  onClose = cb => {
    const animation = morph(200);
    animation.componentWillLeave(
      cb,
      this.dialogRef.current,
      this.pillRef.current
    );
  };
}
