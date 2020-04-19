import React, { useMemo } from 'react';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import { useCurrentRef } from 'core-hooks';
import './additional-withdrawal.css';
import Input from '../../common/input';
import Modal from '../../common/modal';
import additionalWithdrawalForm from '../../form-config/additional-withdrawal-form';
import { useForm } from '../../vendor/forms';

export default function AdditionalWithdrawal({
  isCreate,
  active,
  onCancel,
  onConfirm,
  onDelete,
}) {
  const title = isCreate
    ? 'Add Additional Withdrawal'
    : 'Edit Additional Withdrawal';

  // TODO: reset the form when the modal unmounts
  const useFormInput = useMemo(() => {
    return _.mapValues(additionalWithdrawalForm.values, val => {
      return {
        validators: val.validators,
        initialValue: val.default,
      };
    });
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
    <Modal active={active} onBeginClose={onCancel}>
      <Modal.Title>{title}</Modal.Title>
      <Modal.Body>
        <div>
          <label className="inputLabel" htmlFor="additionalWithdrawalName">
            Withdrawal Name
          </label>
          <Input
            {...inputs.name.getProps({
              id: 'additionalWithdrawalName',
              type: 'text',
              placeholder: 'i.e.; College, New Car, etc.',
            })}
          />
        </div>
        <div>
          <label className="inputLabel" htmlFor="additionalWithdrawalValue">
            Withdrawal Amount
          </label>
          <Input
            {...inputs.value.getProps({
              id: 'additionalWithdrawalValue',
              className: 'input-dollars',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'decimal',
              autoComplete: 'off',
              prefix: '$',
            })}
          />
        </div>
        <div className="formRow formRow-flex">
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
            Adjust for inflation
          </label>
        </div>
        <div className="formRow formRow-flex">
          <Checkbox
            className="checkbox"
            id="additionalWithdrawalRepeats"
            checked={isRecurring}
            onChange={e => {
              updateFormValue('repeats', e.target.checked);
            }}
          />
          <label
            htmlFor="additionalWithdrawalRepeats"
            className="checkbox_label">
            Repeats for several years
          </label>
        </div>
        <div>
          <label className="inputLabel" htmlFor="additionalWithdrawalStartYear">
            {isRecurring && <>Withdrawal starts</>}
            {!isRecurring && <>Withdrawal occurs</>}
          </label>
          <Input
            {...inputs.startYear.getProps({
              id: 'additionalWithdrawalStartYear',
              className: 'input-year',
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
          <div>
            <label className="inputLabel" htmlFor="additionalWithdrawalEndYear">
              and ends
            </label>
            <Input
              {...inputs.endYear.getProps({
                id: 'additionalWithdrawalEndYear',
                className: 'input-year',
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
            className="button button-danger"
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
    </Modal>
  );
}
