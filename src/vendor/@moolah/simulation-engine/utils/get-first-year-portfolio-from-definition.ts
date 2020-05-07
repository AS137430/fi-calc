import { Portfolio, PortfolioDefinition } from '../types';

export default function getFirstYearPortfolioFromDefinition(
  portfolioDefinition: PortfolioDefinition
): Portfolio {
  return {
    totalValue: portfolioDefinition.totalValue,
    totalValueInFirstYearDollars: portfolioDefinition.totalValue,
    investments: portfolioDefinition.investments.map(investmentDefinition => {
      return {
        type: investmentDefinition.type,
        percentage: investmentDefinition.percentage,
        startingPercentage: investmentDefinition.percentage,
        growthAmount: 0,
        feesAmount: 0,
        dividendsAmount: 0,
        valueBeforeChange: investmentDefinition.value,
        valueAfterWithdrawal: investmentDefinition.value,
        valueWithGrowth: investmentDefinition.value,
        value: investmentDefinition.value,
      };
    }),
  };
}
