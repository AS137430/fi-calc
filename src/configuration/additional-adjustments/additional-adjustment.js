import React, { useState } from 'react';
import { formatForDisplay } from '../../vendor/@moolah/lib';
import './additional-adjustment.css';
import UpsertAdditionalAdjustmentModal from './upsert-additional-adjustment-modal';

export default function AdditionalAdjustment({
  type,
  adjustment,
  onSave,
  onDelete,
}) {
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
        <div className="additionalAdjustment_value">
          {formatForDisplay(value)}
        </div>
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
        type={type}
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
