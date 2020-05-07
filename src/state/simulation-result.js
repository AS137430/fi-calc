import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import constate from 'constate';
import runSimulations from '../vendor/@moolah/simulation-engine';
import withdrawalStrategies from '../vendor/@moolah/withdrawal-strategies';
import usePortfolio from './portfolio';
import useHistoricalDataRange from './historical-data-range';
import useWithdrawalStrategy from './withdrawal-strategy';
import useLengthOfRetirement from './length-of-retirement';
import useAdditionalWithdrawals from './additional-withdrawals';
import useAdditionalIncome from './additional-income';
import successRateAnalysis from '../utils/simulation-analytics/success-rate';
import minimumsAnalysis from '../utils/simulation-analytics/minimums';
import marketDataByYear from '../vendor/computed-market-data/market-data-by-year';

const analytics = {
  successRate: successRateAnalysis,
  minimums: minimumsAnalysis,
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

function getWithdrawalMethod(withdrawalStrategyName) {
  if (withdrawalStrategyName === 'portfolioPercent') {
    return 'portfolioPercent';
  } else if (withdrawalStrategyName === 'gk') {
    return 'guytonKlinger';
  } else if (withdrawalStrategyName === '95percent') {
    return 'ninetyFivePercentRule';
  } else if (withdrawalStrategyName === 'capeBased') {
    return 'capeBased';
  }

  return 'constantDollar';
}

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

        const withdrawalMethod = getWithdrawalMethod(
          withdrawalStrategy.withdrawalStrategyName.key
        );

        const {
          annualWithdrawal,
          inflationAdjustedFirstYearWithdrawal,
          percentageOfPortfolio: percentPercentageOfPortfolio,
          minWithdrawalLimit,
          maxWithdrawalLimit,
          minWithdrawalLimitEnabled,
          maxWithdrawalLimitEnabled,
          gkInitialWithdrawal,
          gkWithdrawalUpperLimit,
          gkWithdrawalLowerLimit,
          gkUpperLimitAdjustment,
          gkLowerLimitAdjustment,
          gkIgnoreLastFifteenYears,
          gkModifiedWithdrawalRule,

          ninetyFiveInitialRate,
          ninetyFivePercentage,

          capeWithdrawalRate,
          capeWeight,
        } = withdrawalStrategy;

        const percentageOfPortfolio = percentPercentageOfPortfolio / 100;

        const inputs = {
          lengthOfRetirement,
          portfolio,
          historicalDataRange,
          additionalWithdrawals,
          additionalIncome,
          calculationId: thisCalculationId,
          analytics,
          marketData,
          yearlyWithdrawal({
            simulationNumber,
            year,
            month,
            cumulativeInflation,
            yearMarketData,
            yearsRemaining,
            previousResults,
            isFirstYear,
            startPortfolio,
            firstYearStartPortfolio,
            firstYearCpi,
          }) {
            const minWithdrawal = minWithdrawalLimitEnabled
              ? minWithdrawalLimit * cumulativeInflation
              : 0;
            const maxWithdrawal = maxWithdrawalLimitEnabled
              ? maxWithdrawalLimit * cumulativeInflation
              : Number.MAX_SAFE_INTEGER;
            const yearStartValue = startPortfolio.totalValue;

            if (withdrawalMethod === 'constantDollar') {
              return withdrawalStrategies.constantDollar({
                inflation: cumulativeInflation,
                adjustForInflation: inflationAdjustedFirstYearWithdrawal,
                firstYearWithdrawal: annualWithdrawal,
              }).value;
            } else if (withdrawalMethod === 'portfolioPercent') {
              return withdrawalStrategies.portfolioPercent({
                portfolioTotalValue: yearStartValue,
                percentageOfPortfolio,
                minWithdrawal,
                maxWithdrawal,
              }).value;
            } else if (withdrawalMethod === 'guytonKlinger') {
              return withdrawalStrategies.guytonKlinger({
                stockMarketGrowth: yearMarketData.stockMarketGrowth,
                previousYearBaseWithdrawalAmount: previousResults
                  ? previousResults.baseWithdrawalAmount
                  : 0,
                inflation: cumulativeInflation,
                firstYearStartPortolioTotalValue:
                  firstYearStartPortfolio.totalValue,
                isFirstYear,
                portfolioTotalValue: yearStartValue,
                previousYearCpi: previousResults
                  ? previousResults.startCpi
                  : firstYearCpi,
                yearsRemaining,
                cpi: yearMarketData.cpi,
                minWithdrawal,
                maxWithdrawal,
                initialWithdrawal: gkInitialWithdrawal,
                withdrawalUpperLimit: gkWithdrawalUpperLimit,
                withdrawalLowerLimit: gkWithdrawalLowerLimit,
                upperLimitAdjustment: gkUpperLimitAdjustment,
                lowerLimitAdjustment: gkLowerLimitAdjustment,
                ignoreLastFifteenYears: gkIgnoreLastFifteenYears,
                enableModifiedWithdrawalRule: gkModifiedWithdrawalRule,
              }).value;
            } else if (withdrawalMethod === 'ninetyFivePercentRule') {
              return withdrawalStrategies.ninetyFivePercentRule({
                isFirstYear,
                portfolioTotalValue: yearStartValue,
                previousYearWithdrawalAmount: previousResults
                  ? previousResults.baseWithdrawalAmount
                  : 0,
                firstYearStartPortolioTotalValue:
                  firstYearStartPortfolio.totalValue,
                initialWithdrawalRate: ninetyFiveInitialRate / 100,
                previousYearWithdrawalPercentage: ninetyFivePercentage / 100,
                minWithdrawal,
                maxWithdrawal,
              }).value;
            } else if (withdrawalMethod === 'capeBased') {
              return withdrawalStrategies.capeBased({
                portfolioTotalValue: yearStartValue,
                withdrawalRate: capeWithdrawalRate / 100,
                capeWeight,
                minWithdrawal,
                maxWithdrawal,
                cape:
                  yearMarketData.cape === null
                    ? avgMarketDataCape
                    : yearMarketData.cape,
              }).value;
            }
          },
        };

        setComputation(prev => {
          return {
            ...prev,
            inputs,
            status: 'COMPUTING',
          };
        });

        runSimulations(inputs).then(result => {
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
