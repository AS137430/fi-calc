import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import validators from './validators';
import Dialog from '../dialog';
import { morph } from '../../utils/animations';
import { getUpdatedInputFormState } from '../../utils/forms/form-utils';

export default class PortfolioDialogForm extends Component {
  render() {
    const { onClose } = this.props;
    const { isFormValid, inputs } = this.state;

    const { stockInvestmentValue } = inputs;

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
          <div className="labelContainer">
            <label
              htmlFor="spendingPlan_stockInvestmentValue"
              className="label">
              Equities
            </label>
          </div>
          <div className="input_group">
            <div className="input_extra">$</div>
            <input
              ref={this.stockInvestmentValueRef}
              value={stockInvestmentValue.value}
              className={classnames('input', {
                input_error: stockInvestmentValue.error,
              })}
              type="number"
              pattern="\d*"
              inputMode="numeric"
              step="1"
              min="0"
              max="300"
              id={`spendingPlan_stockInvestmentValue`}
              onChange={event =>
                this.updateValue('stockInvestmentValue', event.target.value)
              }
            />
          </div>
          {stockInvestmentValue.errorMsg && (
            <div className="calculator-errorMsg">
              {stockInvestmentValue.errorMsg}
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
  stockInvestmentValueRef = createRef();

  state = {
    inputs: {
      stockInvestmentValue: {
        value: this.props.stockInvestmentValue,
        error: null,
      },
      inflationAdjustedstockInvestmentValue: {
        value: this.props.inflationAdjustedstockInvestmentValue,
        error: null,
      },
    },
    isFormValid: true,
  };

  componentDidMount() {
    if (this.stockInvestmentValueRef.current) {
      this.stockInvestmentValueRef.current.focus();
      this.stockInvestmentValueRef.current.select();
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
      stockInvestmentValue,
      inflationAdjustedstockInvestmentValue,
    } = this.state.inputs;

    const updates = {
      stockInvestmentValue: stockInvestmentValue.value,
      inflationAdjustedstockInvestmentValue:
        inflationAdjustedstockInvestmentValue.value,
    };

    onConfirm(updates);
  };
}
