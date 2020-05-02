import { PortfolioForm, InvestmentType, Portfolio } from '../types';
import { fromInvestments } from './normalize-portfolio';

interface GetFirstYearStartPortfolioOptions {
  portfolioForm: PortfolioForm;
}

export default function getFirstYearStartPortfolio({
  portfolioForm,
}: GetFirstYearStartPortfolioOptions): Portfolio {
  const {
    bondsValue,
    stockInvestmentValue,
    stockInvestmentFees: percentStockInvestmentFees,
  } = portfolioForm;

  const stockInvestmentFees = percentStockInvestmentFees / 100;
  const investments = [
    {
      type: InvestmentType.equity,
      fees: stockInvestmentFees,
      value: stockInvestmentValue,
    },
    {
      type: InvestmentType.bonds,
      fees: 0,
      value: bondsValue,
    },
  ];

  return fromInvestments({
    investments,
  });
}
