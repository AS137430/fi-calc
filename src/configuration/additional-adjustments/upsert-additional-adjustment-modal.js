import React from 'react';
import Modal from '../../common/modal';
import UpsertAdditionalAdjustmentModalBody from './upsert-additional-adjustment-modal-body';

export default function UpsertAdditionalAdjustmentModal({
  type,
  isCreate,
  active,
  onCancel,
  onConfirm,
  onDelete,
  withdrawal,
}) {
  return (
    <Modal active={active} onBeginClose={onCancel}>
      <UpsertAdditionalAdjustmentModalBody
        type={type}
        withdrawal={withdrawal}
        isCreate={isCreate}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </Modal>
  );
}
