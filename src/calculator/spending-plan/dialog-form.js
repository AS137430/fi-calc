import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import validators from './validators';
import Dialog from '../dialog';
import { morph } from '../../utils/animations';
import { getUpdatedInputFormState } from '../../utils/forms/form-utils';

export default class SpendingPlanDialogForm extends Component {
  render() {
    const { onClose } = this.props;
    const { isFormValid, inputs } = this.state;

    const {
      firstYearWithdrawal,
      inflationAdjustedFirstYearWithdrawal,
    } = inputs;

    return (
      <Dialog
        nodeRef={this.dialogRef}
        open={true}
        onEscPressed={e => {
          e.preventDefault();
          e.stopPropagation();

          onClose();
        }}>
        <h1 className="dialog_header">Spending Plan</h1>
        <div className="dialog_contents">
          <div className="dialog_formRow">
            <div className="labelContainer">
              <label
                htmlFor="spendingPlan_firstYearWithdrawal"
                className="label">
                Annual Spending
              </label>
            </div>
            <div className="input_group">
              <div className="input_extra">$</div>
              <input
                ref={this.firstYearWithdrawalRef}
                value={firstYearWithdrawal.value}
                className={classnames('input', {
                  input_error: firstYearWithdrawal.error,
                })}
                type="number"
                pattern="\d*"
                inputMode="numeric"
                step="1"
                min="0"
                max="300"
                id={`spendingPlan_firstYearWithdrawal`}
                onChange={event =>
                  this.updateValue('firstYearWithdrawal', event.target.value)
                }
              />
            </div>
            {firstYearWithdrawal.errorMsg && (
              <div className="calculator-errorMsg">
                {firstYearWithdrawal.errorMsg}
              </div>
            )}
          </div>
          <div className="dialog_formRow">
            <label className="checkbox_container">
              <Checkbox
                className="checkbox"
                checked={inflationAdjustedFirstYearWithdrawal.value}
                onChange={event =>
                  this.updateValue(
                    'inflationAdjustedFirstYearWithdrawal',
                    event.target.checked
                  )
                }
              />
              <span className="checkbox_label">Adjusted for Inflation</span>
            </label>
          </div>
          {inflationAdjustedFirstYearWithdrawal.value && (
            <div className="dialog_explanation">
              Adjusting for inflation ensures that the amount of stuff you can
              buy each year remains about the same.
            </div>
          )}
          {!inflationAdjustedFirstYearWithdrawal.value && (
            <div className="dialog_explanation">
              Not adjusting for inflation means that you won't be able to buy as
              many things later in your retirement.
            </div>
          )}
        </div>
        <div className="dialog_footer">
          <button className="button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            className="button button-primary"
            type="button"
            onClick={this.onConfirmChanges}>
            Save
          </button>
        </div>
      </Dialog>
    );
  }

  dialogRef = createRef();
  firstYearWithdrawalRef = createRef();

  state = {
    inputs: {
      firstYearWithdrawal: {
        value: this.props.firstYearWithdrawal,
        error: null,
      },
      inflationAdjustedFirstYearWithdrawal: {
        value: this.props.inflationAdjustedFirstYearWithdrawal,
        error: null,
      },
    },
    isFormValid: true,
  };

  componentDidMount() {
    if (this.firstYearWithdrawalRef.current) {
      this.firstYearWithdrawalRef.current.focus();
      this.firstYearWithdrawalRef.current.select();
    }
  }

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

  updateValue = (valueName, newValue, cb) => {
    const { inputs } = this.state;

    const newInputs = _.merge({}, inputs, {
      [valueName]: {
        value: newValue,
      },
    });

    const newFormState = getUpdatedInputFormState({
      inputs: newInputs,
      validators,
    });

    this.setState(
      {
        ...newFormState,
      },
      cb
    );
  };

  onConfirmChanges = () => {
    const { onConfirm } = this.props;
    const {
      firstYearWithdrawal,
      inflationAdjustedFirstYearWithdrawal,
    } = this.state.inputs;

    const numericWithdrawal = Number(firstYearWithdrawal.value);

    let newWithdrawal;
    if (Number.isInteger(numericWithdrawal)) {
      newWithdrawal = String(numericWithdrawal);
    } else {
      newWithdrawal = numericWithdrawal.toFixed(2);
    }

    const updates = {
      firstYearWithdrawal: newWithdrawal,
      inflationAdjustedFirstYearWithdrawal:
        inflationAdjustedFirstYearWithdrawal.value,
    };

    onConfirm(updates);
  };
}
