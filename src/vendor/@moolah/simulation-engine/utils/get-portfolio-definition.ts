import { PortfolioInput, InvestmentType, PortfolioDefinition } from '../types';
import { fromInvestments } from './normalize-portfolio-definition';

interface GetFirstYearStartPortfolioOptions {
  portfolioForm: PortfolioInput;
}

export default function getFirstYearStartPortfolio({
  portfolioForm,
}: GetFirstYearStartPortfolioOptions): PortfolioDefinition {
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
