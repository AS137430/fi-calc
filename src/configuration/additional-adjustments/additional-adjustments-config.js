import React, { useState } from 'react';
import './additional-adjustments-config.css';
import ConfigSection from '../sidebar-section';
import AdditionalAdjustment from './additional-adjustment';
import UpsertAdditionalAdjustmentModal from './upsert-additional-adjustment-modal';
import InfoModal from '../../common/info-modal';

function mapWithdrawalInputToWithdrawal(withdrawal) {
  return {
    ...withdrawal,
    value: Number(withdrawal.value),
    duration: Number(withdrawal.duration),
    startYear: Number(withdrawal.startYear),
  };
}

export default function AdditionalIncome({
  type,
  additionalIncome,
  setAdditionalIncome,
}) {
  const [openModal, setOpenModal] = useState(null);

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
  const isIncome = type === 'income';
  const singularResourceWord = isIncome ? 'Income' : 'Withdrawal';
  const pluralResourceWord = isIncome ? 'Income' : 'Withdrawals';
  const title = `Additional ${pluralResourceWord}`;

  return (
    <>
      <ConfigSection
        title={title}
        initialIsOpen
        count={hasAdditionalIncome ? count : undefined}
        onHelpClick={() => setOpenModal('titleHelp')}>
        <ConfigSection.Contents>
          {!hasAdditionalIncome && (
            <div className="additionalWithdrawalsConfig_noWithdrawals">
              You have no additional {pluralResourceWord.toLowerCase()}.
            </div>
          )}
          {hasAdditionalIncome &&
            additionalIncome.map((withdrawal, index) => {
              return (
                <AdditionalAdjustment
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
            + Add Additional {singularResourceWord}
          </button>
        </ConfigSection.Contents>
      </ConfigSection>
      <UpsertAdditionalAdjustmentModal
        isCreate
        type={type}
        onConfirm={onSaveNewWithdrawal}
        onCancel={() => setOpenModal(null)}
        active={openModal === 'create'}
      />
      <InfoModal
        title={title}
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        {isIncome && (
          <>
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
          </>
        )}
        {!isIncome && (
          <>
            <p>
              You may be planning to make a larger withdrawal for certain years
              of your retirement. For instance, you may decide to contribute to
              a child's college education, or you may have a car that will need
              to be replaced.
            </p>
            <p>
              You can account for these kinds of purchases in this calculator by
              creating <b>additional withdrawals</b>.
            </p>
            <p>
              Additional withdrawals can be a one-time thing, or you can specify
              them as reccurring for a number of years in a row. You can also
              choose whether or not to adjust the amount of the withdrawal for
              inflation.
            </p>
          </>
        )}
      </InfoModal>
    </>
  );
}
