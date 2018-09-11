import _ from 'lodash';
import getStartYears from './get-start-years';
import computeCycle from './compute-cycle';
import evaluateCycles from './evaluate-cycles';
import { fromInvestments } from '../../utils/forms/normalize-portfolio';

export default function computeResult(inputs) {
  const { numberOfYears, firstYearWithdrawal, stockInvestmentValue } = inputs;

  // An array of years that we use as a starting year for cycles
  const startYears = getStartYears();

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

  const spendingConfiguration = {
    // This needs to be fixed!
    spendingMethod: 'inflationAdjusted',
    firstYearWithdrawal: Number(firstYearWithdrawal),
  };

  //
  // The example configuration below demonstrates using the percentOfPortfolio
  // withdrawal method
  //
  // const spendingConfiguration = {
  //   spendingMethod: 'percentOfPortfolio',
  //   percentageOfPortfolio: 0.05,
  //   minWithdrawal: 20000,
  //   maxWithdrawal: 35000
  // };

  const portfolio = fromInvestments({ investments });

  const cycles = _.map(startYears, startYear =>
    computeCycle({
      startYear,
      dipPercentage,
      rebalancePortfolioAnnually,
      portfolio,
      spendingConfiguration,
      duration: Number(numberOfYears),
    })
  );

  const results = evaluateCycles({ cycles });

  const dipRate = `${(results.dipRate * 100).toFixed(2)}%`;

  const rawSuccessRate = results.successRate * 100;

  let successRate;
  if (rawSuccessRate === 100) {
    successRate = `${rawSuccessRate}%`;
  } else {
    successRate = `${rawSuccessRate.toFixed(2)}%`;
  }

  let summary = results.successRate > 0.95 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';

  return {
    summary,
    dipRate,
    successRate,
    lowestDippedValue: results.lowestDippedValue,
  };
}
