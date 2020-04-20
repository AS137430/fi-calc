import React, { useState } from 'react';
import './additional-withdrawals-config.css';
import ConfigSection from '../sidebar-section';
import AdditionalWithdrawal from './additional-withdrawal';
import useAdditionalWithdrawals from '../../state/additional-withdrawals';
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

export default function AdditionalWithdrawals() {
  const [openModal, setOpenModal] = useState(null);
  const [
    additionalWithdrawals,
    setAdditionalWithdrawals,
  ] = useAdditionalWithdrawals();

  function onSaveNewWithdrawal(newWithdrawal) {
    setAdditionalWithdrawals(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals.push(mapWithdrawalInputToWithdrawal(newWithdrawal));
      return updatedWithdrawals;
    });

    setOpenModal(null);
  }

  function onEditWithdrawal(index, withdrawal) {
    setAdditionalWithdrawals(prev => {
      const updatedWithdrawals = [...prev];
      updatedWithdrawals[index] = mapWithdrawalInputToWithdrawal(withdrawal);
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

  const count =
    additionalWithdrawals.length < 10 ? additionalWithdrawals.length : '9+';

  return (
    <>
      <ConfigSection
        title="Additional Withdrawals"
        count={count}
        initialIsOpen
        onHelpClick={() => setOpenModal('titleHelp')}>
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
      <InfoModal
        title="Additional Withdrawals"
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          You may be planning to make a larger withdrawal for certain years of
          your retirement. For instance, for some years you may be contributing
          to a child's college education, or you may be expecting to replace
          your car in a couple of years.
        </p>
        <p>
          You can account for these in this calculator by creating{' '}
          <b>additional withdrawals</b>.
        </p>
        <p>
          Additional withdrawals can be a one-time thing, or you can specify
          them as reccurring for a number of years in a row. You can also choose
          to adjust the amount of the withdrawal for inflation or not.
        </p>
      </InfoModal>
    </>
  );
}
