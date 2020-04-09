import _ from 'lodash';
import getStartYears from './get-start-years';
import computeCycle from './compute-cycle';
import evaluateCycles from './evaluate-cycles';
import { fromInvestments } from '../forms/normalize-portfolio';

export default function computeResult(inputs) {
  const { durationMode, lengthOfRetirement, spendingPlan, portfolio } = inputs;

  const { numberOfYears, startYear, endYear } = lengthOfRetirement;
  const {
    annualSpending,
    inflationAdjustedFirstYearWithdrawal,
    spendingStrategy: spendingStrategyObject,
    percentageOfPortfolio: percentPercentageOfPortfolio,
    minWithdrawalLimit,
    maxWithdrawalLimit,
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
    lengthOfCycle = endYear - startYear;
  }

  const dipPercentage = 0.9;

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
      minWithdrawal: minWithdrawalLimit,
      maxWithdrawal: maxWithdrawalLimit,
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

  const cycles = _.map(startYears, startYear =>
    computeCycle({
      startYear,
      dipPercentage,
      rebalancePortfolioAnnually,
      portfolio: portfolioFromInvestments,
      spendingConfiguration,
      duration: Number(lengthOfCycle),
    })
  );

  const results = evaluateCycles({
    cycles,
  });

  const dipRate = `${(results.dipRate * 100).toFixed(2)}%`;

  const rawSuccessRate = results.successRate * 100;

  let successRate;
  if (rawSuccessRate === 100 || rawSuccessRate === 0) {
    successRate = `${rawSuccessRate}%`;
  } else {
    successRate = `${rawSuccessRate.toFixed(2)}%`;
  }

  let summary = results.successRate > 0.95 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';

  return {
    results,
    summary,
    dipRate,
    successRate,
    lowestDippedValue: results.lowestDippedValue,
  };
}
