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

interface ComputeResultOptions {
  lengthOfRetirement: LengthOfRetirement;
  spendingPlan: SpendingPlan;
  portfolio: Portfolio;
  durationMode: string;
  dipPercentage: number;
  successRateThreshold: number;
}

type Simulation = any;
type Simulations = Array<Simulation>;

interface ComputeResultReturn {
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

export default function computeResult(
  inputs: ComputeResultOptions
): ComputeResultReturn {
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

  let lengthOfCycle = 0;
  let startYears;
  if (durationMode === 'allHistory') {
    lengthOfCycle = numberOfYears;
    // An array of years that we use as a starting year for simulations
    startYears = getStartYears(Number(numberOfYears));
  } else {
    startYears = [Number(startYear)];
    lengthOfCycle = endYear - startYear + 1;
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
      duration: Number(lengthOfCycle),
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
    simulations,
    completeSimulations,
    incompleteSimulations,
    successfulSimulations,
    failedSimulations,
    inputs,
    exceedsSuccessRateThreshold,
    successRate,
    successRateDisplay,
  };
}
