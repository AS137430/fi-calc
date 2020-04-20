import React, { useState } from 'react';
import './additional-withdrawals-config.css';
import ConfigSection from '../sidebar-section';
import AdditionalWithdrawal from './additional-withdrawal';
import UpsertAdditionalWIthdrawalModal from './upsert-additional-withdrawal-modal';

export default function AdditionalWithdrawals() {
  const [openModal, setOpenModal] = useState(null);
  const [additionalWithdrawals, setAdditionalWithdrawals] = useState(() => {
    return [];
  });

  function onSaveNewWithdrawal(newWithdrawal) {
    setAdditionalWithdrawals(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals.push({ ...newWithdrawal });
      return updatedWithdrawals;
    });

    setOpenModal(null);
  }

  function onEditWithdrawal(index, withdrawal) {
    setAdditionalWithdrawals(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals[index] = withdrawal;
      return updatedWithdrawals;
    });
  }

  function onDeleteWithdrawal(index) {
    setAdditionalWithdrawals(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals.splice(index, 1);
      return updatedWithdrawals;
    });
  }

  const hasAdditionalWithdrawals = Boolean(additionalWithdrawals.length);

  return (
    <>
      <ConfigSection title="Additional Withdrawals" initialIsOpen>
        <ConfigSection.Contents>
          {!hasAdditionalWithdrawals && (
            <div className="additionalWithdrawalsConfig_noWithdrawals">
              You have no additional withdrawals.
            </div>
          )}
          {hasAdditionalWithdrawals &&
            additionalWithdrawals.map((withdrawal, index) => {
              return (
                <AdditionalWithdrawal
                  key={index}
                  withdrawal={withdrawal}
                  onDelete={() => onDeleteWithdrawal(index)}
                  onSave={withdrawal => onEditWithdrawal(index, withdrawal)}
                />
              );
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
        onConfirm={onSaveNewWithdrawal}
        onCancel={() => setOpenModal(null)}
        active={openModal === 'create'}
      />
    </>
  );
}
