import { useState } from 'react';
import constate from 'constate';

function useAdditionalWithdrawals() {
  const [additionalWithdrawals, setAdditionalWithdrawals] = useState([]);

  return [additionalWithdrawals, setAdditionalWithdrawals];
}

const [
  AdditionalWithdrawalsProvider,
  useAdditionalWithdrawalsContext,
] = constate(useAdditionalWithdrawals);

export default useAdditionalWithdrawalsContext;
export { AdditionalWithdrawalsProvider };
