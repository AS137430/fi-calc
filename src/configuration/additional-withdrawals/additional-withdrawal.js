import React, { useState } from 'react';
import './additional-withdrawal.css';
import UpsertAdditionalWithdrawalModal from './upsert-additional-withdrawal-modal';

export default function AdditionalWithdrawal() {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <button
        type="button"
        className="additionalWithdrawal"
        onClick={() => setOpenModal('edit')}>
        <div className="additionalWithdrawal_title">College - $40,000</div>
      </button>
      <UpsertAdditionalWithdrawalModal
        isCreate={false}
        active={openModal === 'edit'}
        onCancel={() => setOpenModal(null)}
      />
    </>
  );
}
