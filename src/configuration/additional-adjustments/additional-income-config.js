import React from 'react';
import useAdditionalIncome from '../../state/additional-income';
import AdditionalAdjustments from '../additional-adjustments/additional-adjustments-config';

export default function AdditionalIncome() {
  const [additionalIncome, setAdditionalIncome] = useAdditionalIncome();

  return (
    <AdditionalAdjustments
      type="income"
      additionalAdjustment={additionalIncome}
      setAdditionalAdjustment={setAdditionalIncome}
    />
  );
}
