import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import constate from 'constate';
import usePortfolio from './portfolio';
import useHistoricalDataRange from './historical-data-range';
import useWithdrawalStrategy from './withdrawal-strategy';
import useLengthOfRetirement from './length-of-retirement';
import useAdditionalWithdrawals from './additional-withdrawals';
import useAdditionalIncome from './additional-income';
import runSimulations from '../vendor/@moolah/simulation-engine';
import successRateAnalysis from '../utils/simulation-analytics/success-rate';
import marketDataByYear from '../vendor/computed-market-data/market-data-by-year';

const analytics = {
  successRate: successRateAnalysis,
};

const byYear = marketDataByYear();

const allYears = Object.keys(byYear);
const lastSupportedYear = Number(allYears[allYears.length - 1]);

const marketDataCape = _.map(byYear, val => Number(val.cape)).filter(
  v => !Number.isNaN(v)
);
const avgMarketDataCape =
  _.reduce(marketDataCape, (result, current) => result + current, 0) /
  marketDataCape.length;

const marketData = {
  byYear,
  lastSupportedYear,
  avgMarketDataCape,
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
      lengthOfRetirement,
      withdrawalStrategy,
      portfolio,
      historicalDataRange,
      additionalWithdrawals,
      additionalIncome,
      analytics,
      marketData,
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
          lengthOfRetirement,
          withdrawalStrategy,
          portfolio,
          historicalDataRange,
          additionalWithdrawals,
          additionalIncome,
          calculationId: thisCalculationId,
          analytics,
          marketData,
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
