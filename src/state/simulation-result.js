import { useEffect, useState } from 'react';
import constate from 'constate';
import usePortfolio from './portfolio';
import useSpendingPlan from './spending-plan';
import useLengthOfRetirement from './length-of-retirement';
import runSimulations from '../utils/run-simulations/run-simulations';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

function useSimulationResult() {
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const [computation, setComputation] = useState({
    result: null,
    duration: 0,
  });

  useEffect(
    () => {
      setTimeout(() => {
        const start = performance.now();
        runSimulations(
          {
            durationMode: 'allHistory',
            lengthOfRetirement,
            spendingPlan,
            portfolio,
            dipPercentage: DIP_PERCENTAGE,
            successRateThreshold: SUCCESS_RATE_THRESHOLD,
          },
          result => {
            setComputation({
              result,
              duration: performance.now() - start,
            });
          }
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(spendingPlan),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(lengthOfRetirement),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(portfolio),
    ]
  );

  return computation;
}

const [SimulationResultProvider, useSimulationResultContext] = constate(
  useSimulationResult
);

export default useSimulationResultContext;
export { SimulationResultProvider };
