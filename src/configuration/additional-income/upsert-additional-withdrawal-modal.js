import React from 'react';
import './additional-withdrawal.css';
import Modal from '../../common/modal';
import UpsertAdditionalWithdrawalModalBody from './upsert-additional-withdrawal-modal-body';

export default function AdditionalWithdrawal({
  isCreate,
  active,
  onCancel,
  onConfirm,
  onDelete,
  withdrawal,
}) {
  return (
    <Modal active={active} onBeginClose={onCancel}>
      <UpsertAdditionalWithdrawalModalBody
        withdrawal={withdrawal}
        isCreate={isCreate}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </Modal>
  );
}
