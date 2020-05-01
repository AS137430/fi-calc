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
import successRateAnalysis from './analysis/success-rate';

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
  additionalWithdrawals: AdditionalWithdrawals;
  additionalIncome: AdditionalWithdrawals;
  calculationId: number;
}

interface RunSimulationsReturn {
  simulations: Simulations;
  completeSimulations: Simulations;
  incompleteSimulations: Simulations;
  inputs: RunSimulationsOptions;
  calculationId: number;
  analysis: any;
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
    additionalWithdrawals,
    additionalIncome,
    calculationId,
  } = inputs;

  const { numberOfYears, startYear, endYear } = lengthOfRetirement;

  const analyses: any = {
    successRate: successRateAnalysis,
  };

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
    (startYear, simulationNumber) =>
      runSimulation({
        simulationNumber,
        startYear,
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

      const result: RunSimulationsReturn = {
        // The options that were passed into this function
        inputs,
        // A unique (per-session) number that represents this calculation
        calculationId,
        // All simulations (complete+incomplete, successful+failed)
        simulations,
        // All complete (successful + failed)
        completeSimulations,
        // All incomplete (successful + failed)
        incompleteSimulations,
        analysis: {},
      };

      const simsBlockColor: any = {};
      const perSimAnalysis: any = {};
      simulations.forEach(sim => {
        _.forEach(analyses, (analysisDefinition, analysisName) => {
          const result = analysisDefinition.data.simulation(sim);
          const blockColor = analysisDefinition.data.simulationColor(
            sim,
            result
          );

          if (Array.isArray(perSimAnalysis[analysisName])) {
            perSimAnalysis[analysisName].push(result);
            simsBlockColor[analysisName].push(blockColor);
          } else {
            perSimAnalysis[analysisName] = [result];
            simsBlockColor[analysisName] = [blockColor];
          }
        });
      });

      const analysis = _.mapValues(
        analyses,
        (analysisDefinition, analysisName) => {
          const simAnalysis = perSimAnalysis[analysisName];
          const simBlockColor = simsBlockColor[analysisName];
          const analysis = analysisDefinition.data.overview(
            result,
            simAnalysis
          );
          const display = {
            overview: analysisDefinition.display.overview(
              result,
              analysis,
              simAnalysis
            ),
          };

          return {
            simBlockColor,
            simAnalysis,
            analysis,
            display,
          };
        }
      );

      result.analysis = analysis;

      setTimeout(() => {
        done(result);
        // This is a barely-perceptible amount of time that gives the animation
        // enough time to occur. Although it technically slows down the app
        // by a miniscule amount of time, it actually improves the feeling
        // of making changes because the computation occurs almost instantly.
      }, 20);
    }
  );
}
