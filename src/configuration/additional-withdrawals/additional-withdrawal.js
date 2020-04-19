import React, { useState } from 'react';
import './additional-withdrawal.css';
import UpsertAdditionalWithdrawalModal from './upsert-additional-withdrawal-modal';
import formatNumber from '../../utils/numbers/format-number';

export default function AdditionalWithdrawal({ withdrawal, onSave, onDelete }) {
  const [openModal, setOpenModal] = useState(null);
  const { name, value } = withdrawal;

  function onSaveChanges(withdrawal) {
    setOpenModal(null);
    onSave(withdrawal);
  }

  function onClickDelete() {
    setOpenModal(null);
    onDelete();
  }

  const hasName = Boolean(name);

  return (
    <>
      <button
        type="button"
        className="additionalWithdrawal"
        onClick={() => setOpenModal('edit')}>
        {hasName && <div className="additionalWithdrawal_title">{name}</div>}
        <div>${formatNumber(value)}</div>
      </button>
      <UpsertAdditionalWithdrawalModal
        isCreate={false}
        active={openModal === 'edit'}
        onDelete={onClickDelete}
        onCancel={() => setOpenModal(null)}
        onConfirm={onSaveChanges}
      />
    </>
  );
}
