import React, { Component, createRef, Fragment } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import validators from './validators';
import Dialog from '../dialog';
import { morph } from '../../utils/animations';
import { getUpdatedInputFormState } from '../../utils/forms/form-utils';

export default class DurationDialogForm extends Component {
  render() {
    const { onClose } = this.props;
    const { isFormValid, inputs } = this.state;

    const { numberOfYears, startYear, endYear, durationMode } = inputs;

    return (
      <Dialog
        nodeRef={this.dialogRef}
        open={true}
        onEscPressed={e => {
          e.preventDefault();
          e.stopPropagation();

          onClose();
        }}>
        <h1 className="dialog_header">Length of Retirement</h1>
        <div className="dialog_contents">
          <div className="buttonGroup buttonGroup-centered inputDialog_buttonGroup">
            <button
              className={classnames('button', {
                'button-selected': durationMode.value === 'historicalData',
              })}
              onClick={e => this.switchDurationMode(e, 'historicalData')}>
              All Historical Data
            </button>
            <button
              className={classnames('button', {
                'button-selected': durationMode.value === 'specificYears',
              })}
              onClick={e => this.switchDurationMode(e, 'specificYears')}>
              Specific Years
            </button>
          </div>
          {durationMode.value === 'historicalData' && (
            <Fragment>
              <div className="labelContainer">
                <label
                  htmlFor="inflationAdjusted_numberOfYears"
                  className="label">
                  Number of Years
                </label>
              </div>
              <input
                ref={this.numberOfYearsRef}
                value={numberOfYears.value}
                className={classnames('input calculator-input', {
                  input_error: numberOfYears.error,
                })}
                type="number"
                pattern="\d*"
                inputMode="numeric"
                step="1"
                min="0"
                max="300"
                id={`inflationAdjusted_numberOfYears`}
                onChange={event =>
                  this.updateValue('numberOfYears', event.target.value)
                }
              />
              {numberOfYears.errorMsg && (
                <div className="calculator-errorMsg">
                  {numberOfYears.errorMsg}
                </div>
              )}
            </Fragment>
          )}
          {durationMode.value === 'specificYears' && (
            <Fragment>
              <div className="dialog_formRow">
                <div className="labelContainer">
                  <label
                    htmlFor="inflationAdjusted_startYear"
                    className="label">
                    Start Year
                  </label>
                </div>
                <input
                  ref={this.startYearRef}
                  value={startYear.value}
                  className={classnames('input calculator-input', {
                    input_error: startYear.error,
                  })}
                  type="number"
                  pattern="\d*"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  max="300"
                  id={`inflationAdjusted_startYear`}
                  onChange={event =>
                    this.updateValue('startYear', event.target.value)
                  }
                />
                {startYear.errorMsg && (
                  <div className="calculator-errorMsg">
                    {startYear.errorMsg}
                  </div>
                )}
              </div>
              <div className="dialog_formRow">
                <div className="labelContainer">
                  <label htmlFor="inflationAdjusted_endYear" className="label">
                    End Year
                  </label>
                </div>
                <input
                  value={endYear.value}
                  className={classnames('input calculator-input', {
                    input_error: endYear.error,
                  })}
                  type="number"
                  pattern="\d*"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  max="300"
                  id={`inflationAdjusted_endYear`}
                  onChange={event =>
                    this.updateValue('endYear', event.target.value)
                  }
                />
                {endYear.errorMsg && (
                  <div className="calculator-errorMsg">{endYear.errorMsg}</div>
                )}
              </div>
            </Fragment>
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
  numberOfYearsRef = createRef();
  startYearRef = createRef();

  state = {
    inputs: {
      durationMode: {
        value: this.props.durationMode,
        error: null,
      },
      numberOfYears: {
        value: this.props.numberOfYears,
        error: null,
      },
      startYear: {
        value: this.props.startYear,
        error: null,
      },
      endYear: {
        value: this.props.endYear,
        error: null,
      },
    },
    isFormValid: true,
  };

  componentDidMount() {
    const { durationMode } = this.state.inputs;

    this.focusInput(durationMode.value, true);
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

  switchDurationMode = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();

    this.updateValue('durationMode', mode, () => {
      this.focusInput(mode, false);
    });
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

  focusInput = (mode, select) => {
    if (mode === 'historicalData') {
      if (this.numberOfYearsRef.current) {
        this.numberOfYearsRef.current.focus();
        if (select) {
          this.numberOfYearsRef.current.select();
        }
      }
    } else if (mode === 'specificYears') {
      if (this.startYearRef.current) {
        this.startYearRef.current.focus();
        if (select) {
          this.startYearRef.current.select();
        }
      }
    }
  };

  onConfirmChanges = () => {
    const { onConfirm } = this.props;
    const {
      durationMode,
      numberOfYears,
      startYear,
      endYear,
    } = this.state.inputs;

    let updates;
    if (durationMode.value === 'historicalData') {
      updates = {
        durationMode: 'historicalData',
        numberOfYears: numberOfYears.value,
      };
    } else if (durationMode.value === 'specificYears') {
      updates = {
        durationMode: 'specificYears',
        startYear: startYear.value,
        endYear: endYear.value,
      };
    }

    onConfirm(updates);
  };
}
