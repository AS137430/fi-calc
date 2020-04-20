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
  const title = isCreate ? 'Add Additional Income' : 'Edit Additional Income';

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

  const startYear = Number(inputs.startYear.value);
  const duration = Number(inputs.duration.value);
  const startYearWord = startYear === 1 ? 'year' : 'years';
  const durationYearWord = duration === 1 ? 'year' : 'years';

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
              placeholder: 'Social security, pension, etc...',
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
        <h2 className="modalForm_h2">Income Frequency</h2>
        <div className="modalForm_row">
          <div className="modalForm_labelContainer">
            <label
              className="modalForm_label"
              htmlFor="additionalWithdrawalStartYear">
              Income starts
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
              suffix: `${startYearWord} into retirement`,
            })}
          />
        </div>
        <div className="modalForm_row">
          <div className="modalForm_labelContainer">
            <label
              className="modalForm_label"
              htmlFor="additionalWithdrawalDuration">
              and lasts for
            </label>
          </div>
          <Input
            {...inputs.duration.getProps({
              id: 'additionalWithdrawalDuration',
              className: 'modal_input modal_smallNumberInput',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              suffix: durationYearWord,
            })}
          />
        </div>
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
          {isCreate ? 'Add' : 'Save'}
        </button>
      </Modal.Footer>
    </>
  );
}
