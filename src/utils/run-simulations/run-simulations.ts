import _ from 'lodash';
import getStartYears from './get-start-years';
import runSimulation from './run-simulation';
import { fromInvestments } from '../forms/normalize-portfolio';
import {
  WithdrawalStrategy,
  InvestmentType,
  AdditionalWithdrawals,
  Simulation,
  Simulations,
} from './run-simulations-interfaces';
import asyncMap from '../async-map';

export interface HistoricalDataRange {
  firstYear: number;
  lastYear: number;
  useAllHistoricalData: boolean;
}

interface Portfolio {
  bondsValue: number;
  stockInvestmentValue: number;
  stockInvestmentFees: number;
}

interface LengthOfRetirement {
  numberOfYears: number;
  startYear: number;
  endYear: number;
}

interface RunSimulationsOptions {
  lengthOfRetirement: LengthOfRetirement;
  withdrawalStrategy: WithdrawalStrategy;
  portfolio: Portfolio;
  historicalDataRange: HistoricalDataRange;
  durationMode: string;
  dipPercentage: number;
  successRateThreshold: number;
  additionalWithdrawals: AdditionalWithdrawals;
  additionalIncome: AdditionalWithdrawals;
  calculationId: number;
}

interface RunSimulationsReturn {
  exceedsSuccessRateThreshold: boolean;
  simulations: Simulations;
  successfulSimulations: Simulations;
  completeSimulations: Simulations;
  incompleteSimulations: Simulations;
  failedSimulations: Simulations;
  inputs: RunSimulationsOptions;
  successRate: number;
  successRateDisplay: string;
  calculationId: number;
}

export default function runSimulations(
  inputs: RunSimulationsOptions,
  done: (ret: RunSimulationsReturn) => void
) {
  const {
    historicalDataRange,
    durationMode,
    lengthOfRetirement,
    withdrawalStrategy,
    portfolio,
    dipPercentage,
    successRateThreshold,
    additionalWithdrawals,
    additionalIncome,
    calculationId,
  } = inputs;

  const { numberOfYears, startYear, endYear } = lengthOfRetirement;

  const {
    bondsValue,
    stockInvestmentValue,
    stockInvestmentFees: percentStockInvestmentFees,
  } = portfolio;

  const stockInvestmentFees = percentStockInvestmentFees / 100;

  let lengthOfSimulation = 0;
  let startYears;
  if (durationMode === 'allHistory') {
    lengthOfSimulation = numberOfYears;
    // An array of years that we use as a starting year for simulations
    startYears = getStartYears(
      Number(numberOfYears),
      historicalDataRange.useAllHistoricalData ? undefined : historicalDataRange
    );
  } else {
    startYears = [startYear];
    lengthOfSimulation = endYear - startYear + 1;
  }

  const rebalancePortfolioAnnually = false;
  const investments = [
    {
      type: InvestmentType.equity,
      fees: stockInvestmentFees,
      value: stockInvestmentValue,
      percentage: 1,
    },
    {
      type: InvestmentType.bonds,
      fees: 0,
      value: bondsValue,
      percentage: 0,
    },
  ];

  const portfolioFromInvestments = fromInvestments({
    investments,
  });

  // We do an async map to ensure that this simulation doesn't lock up the main thread.
  // This ensures that the iteration doesn't ever add up to more than 1 frame of time.
  // Pros:
  //   - UI should never completely lock up, even for slow computations
  //   - scaleable to slow + long computations
  // Note: I would prefer this be in a WebWorker, but as of 4/11/20, CRA doesn't have great
  // support for Workers. Once CRA adds support I should consider refactoring this. For more, see:
  // https://github.com/facebook/create-react-app/issues/3660
  asyncMap<number, Simulation>(
    startYears,
    startYear =>
      runSimulation({
        startYear,
        dipPercentage,
        rebalancePortfolioAnnually,
        portfolio: portfolioFromInvestments,
        withdrawalStrategy,
        additionalWithdrawals,
        additionalIncome,
        duration: lengthOfSimulation,
      }),
    simulations => {
      const [completeSimulations, incompleteSimulations] = _.partition(
        simulations,
        'isComplete'
      );
      const [failedSimulations, successfulSimulations] = _.partition(
        completeSimulations,
        'isFailed'
      );
      const successRate = completeSimulations.length
        ? successfulSimulations.length / completeSimulations.length
        : 0;

      const rawSuccessRate = successRate * 100;

      let successRateDisplay;
      if (rawSuccessRate === 100 || rawSuccessRate === 0) {
        successRateDisplay = `${rawSuccessRate}%`;
      } else {
        successRateDisplay = `${rawSuccessRate.toFixed(2)}%`;
      }

      const exceedsSuccessRateThreshold = successRate > successRateThreshold;

      done({
        // All simulations (complete+incomplete, successful+failed)
        simulations,
        // All complete (successful + failed)
        completeSimulations,
        // All incomplete (successful + failed)
        incompleteSimulations,
        // Complete + successful
        successfulSimulations,
        // Complete + failed sims
        failedSimulations,
        // The options that were passed into this function
        inputs,
        // A decimal representing the ratio of successful to unsuccesful sims. i.e.; 0.92333333
        successRate,
        // A string for displaying the success rate. i.e.; "100%" or "93.22%"
        successRateDisplay,
        // A Boolean representing whether or not the sucess rate is high enough to meet
        // the threshold of a "successful" run
        exceedsSuccessRateThreshold,
        calculationId,
      });
    }
  );
}
