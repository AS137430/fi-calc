import { useEffect, useState, useRef } from 'react';
import constate from 'constate';
import usePortfolio from './portfolio';
import useHistoricalDataRange from './historical-data-range';
import useWithdrawalStrategy from './withdrawal-strategy';
import useLengthOfRetirement from './length-of-retirement';
import useAdditionalWithdrawals from './additional-withdrawals';
import useAdditionalIncome from './additional-income';
import runSimulations from '../utils/run-simulations/run-simulations';
import successRateAnalysis from '../utils/simulation-analytics/success-rate';

const analytics = {
  successRate: successRateAnalysis,
};

function useSimulationResult() {
  const { state: historicalDataRange } = useHistoricalDataRange();
  const { state: withdrawalStrategy } = useWithdrawalStrategy();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();
  const [additionalWithdrawals] = useAdditionalWithdrawals();
  const [additionalIncome] = useAdditionalIncome();

  // This is a unique ID that we use to guard against race conditions
  // with this asynchronous calculation
  const calculationIdRef = useRef(0);

  const [computation, setComputation] = useState({
    inputs: {
      durationMode: 'allHistory',
      lengthOfRetirement,
      withdrawalStrategy,
      portfolio,
      historicalDataRange,
      additionalWithdrawals,
      additionalIncome,
      analytics,
    },
    result: null,
    duration: 0,
    status: 'IDLE',
  });

  useEffect(
    () => {
      setTimeout(() => {
        const thisCalculationId = calculationIdRef.current + 1;
        calculationIdRef.current = thisCalculationId;

        const start = performance.now();

        const inputs = {
          durationMode: 'allHistory',
          lengthOfRetirement,
          withdrawalStrategy,
          portfolio,
          historicalDataRange,
          additionalWithdrawals,
          additionalIncome,
          calculationId: thisCalculationId,
          analytics,
        };

        setComputation(prev => {
          return {
            ...prev,
            inputs,
            status: 'COMPUTING',
          };
        });

        runSimulations(inputs, result => {
          // If a new calculation was started then we ignore this one.
          if (calculationIdRef.current !== result.calculationId) {
            return;
          }

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
