import React, { useState } from 'react';
import './additional-adjustment.css';
import UpsertAdditionalAdjustmentModal from './upsert-additional-adjustment-modal';
import formatNumber from '../../utils/numbers/format-number';

export default function AdditionalAdjustment({ adjustment, onSave, onDelete }) {
  const [openModal, setOpenModal] = useState(null);
  const { name, value, inflationAdjusted, startYear, duration } = adjustment;

  function onSaveChanges(adjustment) {
    setOpenModal(null);
    onSave(adjustment);
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
        className="additionalAdjustment"
        onClick={() => setOpenModal('edit')}>
        {hasName && <div className="additionalAdjustment_title">{name}</div>}
        <div className="additionalAdjustment_value">${formatNumber(value)}</div>
        {inflationAdjusted && (
          <div className="additionalAdjustment_inflationAdjusted">
            (Inflation adjusted)
          </div>
        )}
        <div className="additionalAdjustment_frequency">
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
      <UpsertAdditionalAdjustmentModal
        adjustment={adjustment}
        isCreate={false}
        active={openModal === 'edit'}
        onDelete={onClickDelete}
        onCancel={() => setOpenModal(null)}
        onConfirm={onSaveChanges}
      />
    </>
  );
}
