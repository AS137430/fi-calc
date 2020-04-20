import React, { useState } from 'react';
import './additional-withdrawal.css';
import UpsertAdditionalWithdrawalModal from './upsert-additional-withdrawal-modal';
import formatNumber from '../../utils/numbers/format-number';

export default function AdditionalWithdrawal({ withdrawal, onSave, onDelete }) {
  const [openModal, setOpenModal] = useState(null);
  const { name, value, inflationAdjusted, startYear, duration } = withdrawal;

  function onSaveChanges(withdrawal) {
    setOpenModal(null);
    onSave(withdrawal);
  }

  function onClickDelete() {
    setOpenModal(null);
    onDelete();
  }

  const hasName = Boolean(name);
  const isSingularYears = Number(startYear) === 1;
  const startYearsWord = isSingularYears ? 'year' : 'years';
  const numericDuration = Number(duration);
  const durationYearsWord = numericDuration === 1 ? 'year' : 'years';

  return (
    <>
      <button
        type="button"
        className="additionalWithdrawal"
        onClick={() => setOpenModal('edit')}>
        {hasName && <div className="additionalWithdrawal_title">{name}</div>}
        <div className="additionalWithdrawal_value">${formatNumber(value)}</div>
        {inflationAdjusted && (
          <div className="additionalWithdrawal_inflationAdjusted">
            (Inflation adjusted)
          </div>
        )}
        <div className="additionalWithdrawal_frequency">
          {numericDuration === 1 && (
            <>
              Occurs {startYear} {startYearsWord} into retirement
            </>
          )}
          {numericDuration > 1 && (
            <>
              Starts {startYear} {startYearsWord} into retirement and lasts for{' '}
              {numericDuration} {durationYearsWord}.
            </>
          )}
        </div>
      </button>
      <UpsertAdditionalWithdrawalModal
        withdrawal={withdrawal}
        isCreate={false}
        active={openModal === 'edit'}
        onDelete={onClickDelete}
        onCancel={() => setOpenModal(null)}
        onConfirm={onSaveChanges}
      />
    </>
  );
}
