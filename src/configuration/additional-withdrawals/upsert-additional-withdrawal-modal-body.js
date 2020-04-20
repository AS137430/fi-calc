import React, { useMemo } from 'react';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import { useCurrentRef } from 'core-hooks';
import Modal from '../../common/modal';
import Input from '../../common/input';
import additionalWithdrawalForm from '../../form-config/additional-withdrawal-form';
import { useForm } from '../../vendor/forms';

export default function UpsertAdditionalWithdrawalModalBody({
  isCreate,
  onCancel,
  onConfirm,
  onDelete,
  withdrawal,
}) {
  const title = isCreate
    ? 'Add Additional Withdrawal'
    : 'Edit Additional Withdrawal';

  const useFormInput = useMemo(() => {
    const hasWithdrawal = Boolean(withdrawal);
    return _.mapValues(additionalWithdrawalForm.values, (val, key) => {
      const valToUse =
        hasWithdrawal && typeof withdrawal[key] !== 'undefined'
          ? withdrawal[key]
          : val.default;

      return {
        validators: val.validators,
        initialValue: valToUse,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { inputs, formIsValid, updateFormValue } = useForm(useFormInput);

  const inputsRef = useCurrentRef(inputs);
  const onConfirmRef = useCurrentRef(onConfirm);

  function handleClickConfirm() {
    const values = _.mapValues(inputsRef.current, val => {
      return val.value;
    });

    if (typeof onConfirmRef.current === 'function') {
      return onConfirmRef.current(values);
    }
  }

  const isRecurring = inputs.repeats.value;
  return (
    <>
      <Modal.Title>{title}</Modal.Title>
      <Modal.Body>
        <div className="modalForm_row">
          <div className="modalForm_labelContainer">
            <label
              className="modalForm_label"
              htmlFor="additionalWithdrawalName">
              Name <span className="modalForm_optional">(Optional)</span>
            </label>
          </div>
          <Input
            {...inputs.name.getProps({
              id: 'additionalWithdrawalName',
              className: 'modal_input modal_standardWidthInput',
              type: 'text',
              placeholder: 'i.e.; College, new car, etc.',
            })}
          />
        </div>
        <div className="modalForm_row">
          <div className="modalForm_labelContainer">
            <label
              className="modalForm_label"
              htmlFor="additionalWithdrawalValue">
              Amount
            </label>
          </div>
          <Input
            {...inputs.value.getProps({
              id: 'additionalWithdrawalValue',
              className: 'modal_input modal_standardWidthInput',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'decimal',
              autoComplete: 'off',
              prefix: '$',
            })}
          />
        </div>
        <div className="modalForm_row modalForm_row-flex">
          <Checkbox
            className="checkbox"
            id="additionalWithdrawalInflationAdjusted"
            checked={inputs.inflationAdjusted.value}
            onChange={e => {
              updateFormValue('inflationAdjusted', e.target.checked);
            }}
          />
          <label
            htmlFor="additionalWithdrawalInflationAdjusted"
            className="checkbox_label">
            Adjust amount for inflation
          </label>
        </div>
        <div className="formRow_separator" />
        <h2 className="modalForm_h2">Withdrawal Frequency</h2>
        <div className="modalForm_row modalForm_row-flex">
          <Checkbox
            className="checkbox"
            id="additionalWithdrawalRepeats"
            checked={!isRecurring}
            onChange={e => {
              updateFormValue('repeats', !e.target.checked);
            }}
          />
          <label
            htmlFor="additionalWithdrawalRepeats"
            className="checkbox_label">
            Only occurs in one year
          </label>
        </div>
        <div className="modalForm_row">
          <div className="modalForm_labelContainer">
            <label
              className="modalForm_label"
              htmlFor="additionalWithdrawalStartYear">
              {isRecurring && <>Withdrawal starts</>}
              {!isRecurring && <>Withdrawal occurs</>}
            </label>
          </div>
          <Input
            {...inputs.startYear.getProps({
              id: 'additionalWithdrawalStartYear',
              className: 'modal_input modal_smallNumberInput',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              suffix: 'years into retirement',
            })}
          />
        </div>
        {isRecurring && (
          <div className="modalForm_row">
            <div className="modalForm_labelContainer">
              <label
                className="modalForm_label"
                htmlFor="additionalWithdrawalEndYear">
                and ends
              </label>
            </div>
            <Input
              {...inputs.endYear.getProps({
                id: 'additionalWithdrawalEndYear',
                className: 'modal_input modal_smallNumberInput',
                type: 'number',
                pattern: '\\d*',
                min: 0,
                inputMode: 'numeric',
                autoComplete: 'off',
                suffix: 'years into retirement',
              })}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isCreate && (
          <button
            className="button button-danger modal_deleteBtn"
            type="button"
            onClick={onDelete}>
            Delete
          </button>
        )}
        <button
          className="button button-secondary"
          type="button"
          onClick={onCancel}>
          Cancel
        </button>
        <button
          className="button button-primary"
          type="button"
          disabled={!formIsValid}
          onClick={handleClickConfirm}>
          {isCreate ? 'Add' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </>
  );
}
