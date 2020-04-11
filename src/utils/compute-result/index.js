import _ from 'lodash';
import getStartYears from './get-start-years';
import computeCycle from './compute-cycle';
import { fromInvestments } from '../forms/normalize-portfolio';

export default function computeResult(inputs) {
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
    annualSpending,
    inflationAdjustedFirstYearWithdrawal,
    spendingStrategy: spendingStrategyObject,
    percentageOfPortfolio: percentPercentageOfPortfolio,
    minWithdrawalLimit,
    maxWithdrawalLimit,
    minWithdrawalLimitEnabled,
    maxWithdrawalLimitEnabled,
  } = spendingPlan;

  const {
    bondsValue,
    stockInvestmentValue,
    stockInvestmentFees: percentStockInvestmentFees,
  } = portfolio;

  const firstYearWithdrawal = annualSpending;
  const spendingStrategy = spendingStrategyObject.key;
  const stockInvestmentFees = percentStockInvestmentFees / 100;
  const percentageOfPortfolio = percentPercentageOfPortfolio / 100;

  let lengthOfCycle;
  let startYears;
  if (durationMode === 'allHistory') {
    lengthOfCycle = numberOfYears;
    // An array of years that we use as a starting year for cycles
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

  let spendingConfiguration;
  if (spendingStrategy === 'portfolioPercent') {
    spendingConfiguration = {
      // These are necessary for this computation...
      minWithdrawal: minWithdrawalLimitEnabled ? minWithdrawalLimit : 0,
      maxWithdrawal: maxWithdrawalLimitEnabled
        ? maxWithdrawalLimit
        : Number.MAX_SAFE_INTEGER,
      spendingMethod: 'portfolioPercent',
      percentageOfPortfolio,
    };
  } else {
    spendingConfiguration = {
      spendingMethod: inflationAdjustedFirstYearWithdrawal
        ? 'inflationAdjusted'
        : 'notInflationAdjusted',
      firstYearWithdrawal: Number(firstYearWithdrawal),
    };
  }

  const portfolioFromInvestments = fromInvestments({
    investments,
  });

  const simulations = _.map(startYears, startYear =>
    computeCycle({
      startYear,
      dipPercentage,
      rebalancePortfolioAnnually,
      portfolio: portfolioFromInvestments,
      spendingConfiguration,
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
