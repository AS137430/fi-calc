import { useEffect, useState } from 'react';
import constate from 'constate';
import usePortfolio from './portfolio';
import useHistoricalDataRange from './historical-data-range';
import useWithdrawalStrategy from './withdrawal-strategy';
import useLengthOfRetirement from './length-of-retirement';
import useAdditionalWithdrawals from './additional-withdrawals';
import useAdditionalIncome from './additional-income';
import runSimulations from '../utils/run-simulations/run-simulations';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

function useSimulationResult() {
  const { state: historicalDataRange } = useHistoricalDataRange();
  const { state: withdrawalStrategy } = useWithdrawalStrategy();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();
  const [additionalWithdrawals] = useAdditionalWithdrawals();
  const [additionalIncome] = useAdditionalIncome();

  const [computation, setComputation] = useState({
    inputs: {
      durationMode: 'allHistory',
      lengthOfRetirement,
      withdrawalStrategy,
      portfolio,
      historicalDataRange,
      additionalWithdrawals,
      additionalIncome,
      dipPercentage: DIP_PERCENTAGE,
      successRateThreshold: SUCCESS_RATE_THRESHOLD,
    },
    result: null,
    duration: 0,
    status: 'IDLE',
  });

  useEffect(
    () => {
      setTimeout(() => {
        const start = performance.now();

        const inputs = {
          durationMode: 'allHistory',
          lengthOfRetirement,
          withdrawalStrategy,
          portfolio,
          historicalDataRange,
          additionalWithdrawals,
          additionalIncome,
          dipPercentage: DIP_PERCENTAGE,
          successRateThreshold: SUCCESS_RATE_THRESHOLD,
        };

        setComputation(prev => {
          return {
            ...prev,
            inputs,
            status: 'COMPUTING',
          };
        });

        runSimulations(inputs, result => {
          setComputation({
            result,
            inputs,
            duration: performance.now() - start,
            status: 'COMPLETE',
          });
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(withdrawalStrategy),
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
