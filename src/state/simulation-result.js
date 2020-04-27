import { useEffect, useState } from 'react';
import constate from 'constate';
import usePortfolio from './portfolio';
import useHistoricalDataRange from './historical-data-range';
import useWithdrawalPlan from './withdrawal-plan';
import useLengthOfRetirement from './length-of-retirement';
import useAdditionalWithdrawals from './additional-withdrawals';
import useAdditionalIncome from './additional-income';
import runSimulations from '../utils/run-simulations/run-simulations';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

function useSimulationResult() {
  const { state: historicalDataRange } = useHistoricalDataRange();
  const { state: withdrawalPlan } = useWithdrawalPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();
  const [additionalWithdrawals] = useAdditionalWithdrawals();
  const [additionalIncome] = useAdditionalIncome();

  const [computation, setComputation] = useState({
    result: null,
    duration: 0,
    status: 'IDLE',
  });

  useEffect(
    () => {
      setTimeout(() => {
        const start = performance.now();

        setComputation(prev => {
          return {
            ...prev,
            status: 'COMPUTING',
          };
        });

        runSimulations(
          {
            durationMode: 'allHistory',
            lengthOfRetirement,
            withdrawalPlan,
            portfolio,
            historicalDataRange,
            additionalWithdrawals,
            additionalIncome,
            dipPercentage: DIP_PERCENTAGE,
            successRateThreshold: SUCCESS_RATE_THRESHOLD,
          },
          result => {
            setComputation({
              result,
              duration: performance.now() - start,
              status: 'COMPLETE',
            });
          }
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(withdrawalPlan),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(lengthOfRetirement),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(portfolio),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(historicalDataRange),
      additionalWithdrawals,
      additionalIncome,
    ]
  );

  return computation;
}

const [SimulationResultProvider, useSimulationResultContext] = constate(
  useSimulationResult
);

export default useSimulationResultContext;
export { SimulationResultProvider };
