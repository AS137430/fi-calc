import _ from 'lodash';
import getStartYears from './get-start-years';
import runSimulation from './run-simulation';
import { fromInvestments } from '../forms/normalize-portfolio';

interface SpendingPlan {
  annualSpending: number;
  inflationAdjustedFirstYearWithdrawal: boolean;
  spendingStrategy: {
    key: string;
  };
  percentageOfPortfolio: number;
  minWithdrawalLimit: number;
  maxWithdrawalLimit: number;
  minWithdrawalLimitEnabled: boolean;
  maxWithdrawalLimitEnabled: boolean;
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
  spendingPlan: SpendingPlan;
  portfolio: Portfolio;
  durationMode: string;
  dipPercentage: number;
  successRateThreshold: number;
}

type Simulation = any;
type Simulations = Array<Simulation>;

interface RunSimulationsReturn {
  exceedsSuccessRateThreshold: boolean;
  simulations: Simulations;
  successfulSimulations: Simulations;
  completeSimulations: Simulations;
  incompleteSimulations: Simulations;
  failedSimulations: Simulations;
  inputs: any;
  successRate: number;
  successRateDisplay: string;
}

export default function runSimulations(
  inputs: RunSimulationsOptions
): RunSimulationsReturn {
  const {
    durationMode,
    lengthOfRetirement,
    spendingPlan,
    portfolio,
    dipPercentage,
    successRateThreshold,
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
    startYears = getStartYears(Number(numberOfYears));
  } else {
    startYears = [Number(startYear)];
    lengthOfSimulation = endYear - startYear + 1;
  }

  const rebalancePortfolioAnnually = false;
  const investments = [
    {
      type: 'equity',
      fees: stockInvestmentFees,
      value: stockInvestmentValue,
      percentage: 1,
    },
    {
      type: 'bonds',
      fees: 0,
      value: bondsValue,
      percentage: 0,
    },
  ];

  const portfolioFromInvestments = fromInvestments({
    investments,
  });

  const simulations = _.map(startYears, startYear =>
    runSimulation({
      startYear,
      dipPercentage,
      rebalancePortfolioAnnually,
      portfolio: portfolioFromInvestments,
      spendingPlan,
      duration: Number(lengthOfSimulation),
    })
  );

  const [completeSimulations, incompleteSimulations] = _.partition(
    simulations,
    'isComplete'
  );
  const [failedSimulations, successfulSimulations] = _.partition(
    completeSimulations,
    'isFailed'
  );
  const successRate = successfulSimulations.length / completeSimulations.length;

  const rawSuccessRate = successRate * 100;

  let successRateDisplay;
  if (rawSuccessRate === 100 || rawSuccessRate === 0) {
    successRateDisplay = `${rawSuccessRate}%`;
  } else {
    successRateDisplay = `${rawSuccessRate.toFixed(2)}%`;
  }

  const exceedsSuccessRateThreshold = successRate > successRateThreshold;

  return {
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
  };
}
