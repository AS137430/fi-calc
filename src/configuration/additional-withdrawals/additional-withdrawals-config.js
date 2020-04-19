import React, { useState } from 'react';
import './additional-withdrawals-config.css';
import ConfigSection from '../sidebar-section';
import AdditionalWithdrawal from './additional-withdrawal';
import UpsertAdditionalWIthdrawalModal from './upsert-additional-withdrawal-modal';

const DEFAULT_INITIAL_WITHDRAWAL = {
  value: 40000,
};

export default function AdditionalWithdrawals() {
  const [openModal, setOpenModal] = useState(null);
  const [additionalWithdrawals, setAdditionalWithdrawals] = useState(() => {
    return [DEFAULT_INITIAL_WITHDRAWAL];
  });

  function onSave(inputs) {
    setAdditionalWithdrawals(prev => {
      const newSpending = [...prev];
      newSpending.push({ ...inputs });
      return newSpending;
    });

    setOpenModal(null);
  }

  return (
    <>
      <ConfigSection title="Additional Withdrawals" initialIsOpen>
        <ConfigSection.Contents className="form_blockSection">
          {additionalWithdrawals.map((spending, index) => {
            return <AdditionalWithdrawal key={index} />;
          })}
          <button
            className="button button-secondary button-small additionalWithdrawals_createBtn"
            onClick={() => setOpenModal('create')}>
            + Add Additional Withdrawal
          </button>
        </ConfigSection.Contents>
      </ConfigSection>
      <UpsertAdditionalWIthdrawalModal
        isCreate
        onConfirm={onSave}
        onCancel={() => setOpenModal(null)}
        active={openModal === 'create'}
      />
    </>
  );
}
