import _ from 'lodash';
import getStartYears from './get-start-years';
import computeCycle from './compute-cycle';
import evaluateCycles from './evaluate-cycles';
import { fromInvestments } from '../../utils/forms/normalize-portfolio';

export default function computeResult(inputs) {
  const {
    duration,
    firstYearWithdrawal,
    stockInvestmentValue,
    spendingMethod,
  } = inputs;

  // An array of years that we use as a starting year for cycles
  const startYears = getStartYears();

  const dipPercentage = 0.9;

  const rebalancePortfolioAnnually = false;
  const investments = [
    {
      type: 'equity',
      fees: 0.0,
      value: Number(stockInvestmentValue.value),
      percentage: 1,
    },
  ];

  const spendingConfiguration = {
    spendingMethod: spendingMethod.value,
    firstYearWithdrawal: Number(firstYearWithdrawal.value),
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
      duration: Number(duration.value),
    })
  );

  const results = evaluateCycles({ cycles });

  const dipRate = `${(results.dipRate * 100).toFixed(2)}%`;
  const successRate = `${(results.successRate * 100).toFixed(2)}%`;

  let summary = results.successRate > 0.95 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';

  return {
    summary,
    dipRate,
    successRate,
    lowestDippedValue: results.lowestDippedValue,
  };
}
