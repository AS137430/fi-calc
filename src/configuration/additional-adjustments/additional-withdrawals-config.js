import React from 'react';
import AdditionalAdjustments from '../additional-adjustments/additional-adjustments-config';
import useAdditionalWithdrawals from '../../state/additional-withdrawals';

export default function AdditionalIncome() {
  const [additionalIncome, setAdditionalIncome] = useAdditionalWithdrawals();

  return (
    <AdditionalAdjustments
      type="withdrawals"
      additionalAdjustment={additionalIncome}
      setAdditionalAdjustment={setAdditionalIncome}
    />
  );
}
