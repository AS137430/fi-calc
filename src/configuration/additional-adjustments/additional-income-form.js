import React from 'react';
import useAdditionalIncome from '../../state/additional-income';
import AdditionalAdjustmentsForm from './additional-adjustments-form';

export default function AdditionalIncomeForm() {
  const [additionalIncome, setAdditionalIncome] = useAdditionalIncome();

  return (
    <AdditionalAdjustmentsForm
      type="income"
      additionalAdjustment={additionalIncome}
      setAdditionalAdjustment={setAdditionalIncome}
    />
  );
}
