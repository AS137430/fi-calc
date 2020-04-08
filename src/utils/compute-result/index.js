import _ from 'lodash';
import getStartYears from './get-start-years';
import computeCycle from './compute-cycle';
import evaluateCycles from './evaluate-cycles';
import { fromInvestments } from '../forms/normalize-portfolio';

export default function computeResult(inputs) {
  const {
    durationMode,
    startYear,
    endYear,
    numberOfYears,
    firstYearWithdrawal,
    inflationAdjustedFirstYearWithdrawal,
    stockInvestmentValue,
    spendingStrategy,
    percentageOfPortfolio,
    minWithdrawalLimit,
    maxWithdrawalLimit,
  } = inputs;

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
      fees: 0.0,
      value: Number(stockInvestmentValue),
      percentage: 1,
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

  const portfolio = fromInvestments({
    investments,
  });

  const cycles = _.map(startYears, startYear =>
    computeCycle({
      startYear,
      dipPercentage,
      rebalancePortfolioAnnually,
      portfolio,
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
