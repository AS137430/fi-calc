import _ from 'lodash';
import runSimulation from './run-simulation';
import {
  RunSimulationsOptions,
  RunSimulationsReturn,
  Simulation,
} from './types';
import asyncMap from '../async-map';
import calculateDuration from './utils/calculate-duration';
import getFirstYearStartPortfolio from './utils/get-first-year-start-portfolio';
import runAnalysis from './utils/run-analysis';

export default function runSimulations(
  inputs: RunSimulationsOptions,
  done: (ret: RunSimulationsReturn) => void
) {
  const {
    historicalDataRange,
    lengthOfRetirement,
    withdrawalStrategy,
    portfolio,
    additionalWithdrawals,
    additionalIncome,
    calculationId,
    analytics,
  } = inputs;

  const { lengthOfSimulation, startYears } = calculateDuration({
    lengthOfRetirement,
    historicalDataRange,
  });

  const rebalancePortfolioAnnually = false;
  const firstYearStartPortfolio = getFirstYearStartPortfolio({
    portfolio,
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
        portfolio: firstYearStartPortfolio,
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

      result.analysis = runAnalysis({
        simulations,
        analytics,
        result,
      });

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
