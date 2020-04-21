import { useState } from 'react';
import constate from 'constate';

function useAdditionalIncome() {
  const [additionalIncome, setAdditionalIncome] = useState([]);

  return [additionalIncome, setAdditionalIncome];
}

const [AdditionalIncomeProvider, useAdditionalIncomeContext] = constate(
  useAdditionalIncome
);

export default useAdditionalIncomeContext;
export { AdditionalIncomeProvider };
