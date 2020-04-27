import React from 'react';
import AdditionalAdjustmentsForm from './additional-adjustments-form';
import useAdditionalWithdrawals from '../../state/additional-withdrawals';

export default function AdditionalWithdrawalsForm() {
  const [
    additionalWithdrawals,
    setAdditionalWithdrawals,
  ] = useAdditionalWithdrawals();

  return (
    <AdditionalAdjustmentsForm
      type="withdrawals"
      additionalAdjustment={additionalWithdrawals}
      setAdditionalAdjustment={setAdditionalWithdrawals}
    />
  );
}
