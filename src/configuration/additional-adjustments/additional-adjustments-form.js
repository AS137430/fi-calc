import React, { useState } from 'react';
import './additional-adjustments-form.css';
import ConfigSection from '../sidebar-section';
import AdditionalAdjustment from './additional-adjustment';
import UpsertAdditionalAdjustmentModal from './upsert-additional-adjustment-modal';
import InfoModal from '../../common/info-modal';

// Input values are always strings, so this converts the numeric values
// to numbers.
function mapAdjustmentInputToAdjustment(adjustment) {
  return {
    ...adjustment,
    value: Number(adjustment.value),
    duration: Number(adjustment.duration),
    startYear: Number(adjustment.startYear),
  };
}

export default function AdditionalAdjustmentsForm({
  type,
  additionalAdjustment,
  setAdditionalAdjustment,
}) {
  const [openModal, setOpenModal] = useState(null);

  function onSaveNewAdjustment(newAdjustment) {
    setAdditionalAdjustment(prev => {
      const updatedAdjustments = [...prev];
      updatedAdjustments.push(mapAdjustmentInputToAdjustment(newAdjustment));
      return updatedAdjustments;
    });

    setOpenModal(null);
  }

  function onEditAdjustment(index, adjustment) {
    setAdditionalAdjustment(prev => {
      const updatedAdjustments = [...prev];
      updatedAdjustments[index] = mapAdjustmentInputToAdjustment(adjustment);
      return updatedAdjustments;
    });
  }

  function onDeleteAdjustment(index) {
    setAdditionalAdjustment(prev => {
      const updatedAdjustments = [...prev];
      updatedAdjustments.splice(index, 1);
      return updatedAdjustments;
    });
  }

  const hasAdditionalAdjustment = Boolean(additionalAdjustment.length);

  const count =
    additionalAdjustment.length < 10 ? additionalAdjustment.length : '9+';
  const isIncome = type === 'income';
  const singularResourceWord = isIncome ? 'Income' : 'Withdrawal';
  const pluralResourceWord = isIncome ? 'Income' : 'Withdrawals';
  const title = `Additional ${pluralResourceWord}`;

  return (
    <>
      <ConfigSection
        title={title}
        count={hasAdditionalAdjustment ? count : undefined}
        onHelpClick={() => setOpenModal('titleHelp')}>
        <ConfigSection.Contents>
          {!hasAdditionalAdjustment && (
            <div className="additionalAdjustmentsConfig_noWithdrawals">
              You have no additional {pluralResourceWord.toLowerCase()}.
            </div>
          )}
          {hasAdditionalAdjustment &&
            additionalAdjustment.map((adjustment, index) => {
              return (
                <AdditionalAdjustment
                  key={index}
                  type={type}
                  adjustment={adjustment}
                  onDelete={() => onDeleteAdjustment(index)}
                  onSave={adjustment => onEditAdjustment(index, adjustment)}
                />
              );
            })}
          <button
            className="button button-secondary button-small additionalAdjustments_createBtn"
            onClick={() => setOpenModal('create')}>
            + Add Additional {singularResourceWord}
          </button>
        </ConfigSection.Contents>
      </ConfigSection>
      <UpsertAdditionalAdjustmentModal
        isCreate
        type={type}
        onConfirm={onSaveNewAdjustment}
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
            <p>
              Note that additional income in this calculator is specified as the{' '}
              <b>yearly sum</b> of each source of income.
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
