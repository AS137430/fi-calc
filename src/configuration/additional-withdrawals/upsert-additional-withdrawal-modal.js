import React, { useMemo } from 'react';
import _ from 'lodash';
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

  const useFormInput = useMemo(() => {
    return _.mapValues(additionalWithdrawalForm.values, val => {
      return {
        validators: val.validators,
        initialValue: val.default,
      };
    });
  }, []);

  const { inputs, formIsValid } = useForm(useFormInput);
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

  return (
    <Modal active={active} onBeginClose={onCancel}>
      <Modal.Title>{title}</Modal.Title>
      <Modal.Body>
        {/* <p>Edit your additional withdrawal here.</p> */}
        <div>
          <label className="inputLabel" htmlFor="additionalWithdrawalName">
            Label
          </label>
          <Input
            {...inputs.name.getProps({
              id: 'additionalWithdrawalName',
              type: 'text',
              placeholder: 'i.e.; College, New Car, etc.',
            })}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="button button-danger"
          type="button"
          onClick={onDelete}>
          Delete
        </button>
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
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
