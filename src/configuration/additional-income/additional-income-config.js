import React, { useState } from 'react';
import './additional-income-config.css';
import ConfigSection from '../sidebar-section';
import AdditionalWithdrawal from './additional-withdrawal';
import useAdditionalIncome from '../../state/additional-income';
import UpsertAdditionalWIthdrawalModal from './upsert-additional-withdrawal-modal';
import InfoModal from '../../common/info-modal';

function mapWithdrawalInputToWithdrawal(withdrawal) {
  return {
    ...withdrawal,
    value: Number(withdrawal.value),
    duration: Number(withdrawal.duration),
    startYear: Number(withdrawal.startYear),
  };
}

export default function AdditionalIncome() {
  const [openModal, setOpenModal] = useState(null);
  const [additionalIncome, setAdditionalIncome] = useAdditionalIncome();

  function onSaveNewWithdrawal(newWithdrawal) {
    setAdditionalIncome(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals.push(mapWithdrawalInputToWithdrawal(newWithdrawal));
      return updatedWithdrawals;
    });

    setOpenModal(null);
  }

  function onEditWithdrawal(index, withdrawal) {
    setAdditionalIncome(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals[index] = mapWithdrawalInputToWithdrawal(withdrawal);
      return updatedWithdrawals;
    });
  }

  function onDeleteWithdrawal(index) {
    setAdditionalIncome(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals.splice(index, 1);
      return updatedWithdrawals;
    });
  }

  const hasAdditionalIncome = Boolean(additionalIncome.length);

  const count = additionalIncome.length < 10 ? additionalIncome.length : '9+';

  return (
    <>
      <ConfigSection
        title="Additional Income"
        initialIsOpen
        count={hasAdditionalIncome ? count : undefined}
        onHelpClick={() => setOpenModal('titleHelp')}>
        <ConfigSection.Contents>
          {!hasAdditionalIncome && (
            <div className="additionalWithdrawalsConfig_noWithdrawals">
              You have no additional income.
            </div>
          )}
          {hasAdditionalIncome &&
            additionalIncome.map((withdrawal, index) => {
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
            + Add Additional Income
          </button>
        </ConfigSection.Contents>
      </ConfigSection>
      <UpsertAdditionalWIthdrawalModal
        isCreate
        onConfirm={onSaveNewWithdrawal}
        onCancel={() => setOpenModal(null)}
        active={openModal === 'create'}
      />
      <InfoModal
        title="Additional Income"
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Retiring doesn't necessarily mean that you no longer have income
          coming in. Common sources of additional income during retirement
          include:
        </p>
        <ul>
          <li>A pension</li>
          <li>Social security</li>
          <li>A part time job</li>
          <li>A side project that brings in money</li>
        </ul>
        <p>
          You can account for these and other sources of income by creating{' '}
          <b>additional income</b> in this calculator.
        </p>
      </InfoModal>
    </>
  );
}
