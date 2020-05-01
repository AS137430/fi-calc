import { PortfolioInput, InvestmentType, Portfolio } from '../types';
import { fromInvestments } from './normalize-portfolio';

interface GetFirstYearStartPortfolioOptions {
  portfolio: PortfolioInput;
}

export default function getFirstYearStartPortfolio({
  portfolio,
}: GetFirstYearStartPortfolioOptions): Portfolio {
  const {
    bondsValue,
    stockInvestmentValue,
    stockInvestmentFees: percentStockInvestmentFees,
  } = portfolio;

  const stockInvestmentFees = percentStockInvestmentFees / 100;
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

  return fromInvestments({
    investments,
  });
}
