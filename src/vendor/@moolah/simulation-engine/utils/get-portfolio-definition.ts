import { PortfolioInput, PortfolioDefinition, InvestmentType } from '../types';
import { fromInvestments } from './normalize-portfolio-definition';

interface GetFirstYearStartPortfolioOptions {
  portfolioForm: PortfolioInput;
}

interface FromInvestmentsInvestment {
  type: InvestmentType;
  fees: number;
  value: number;
}

export default function getPortfolioDefinition({
  portfolioForm,
}: GetFirstYearStartPortfolioOptions): PortfolioDefinition {
  const {
    bondsValue,
    stockInvestmentValue,
    stockInvestmentFees: percentStockInvestmentFees,
  } = portfolioForm;

  const stockInvestmentFees = percentStockInvestmentFees / 100;
  const investments: FromInvestmentsInvestment[] = [
    {
      type: 'equity',
      fees: stockInvestmentFees,
      value: stockInvestmentValue,
    },
    {
      type: 'bonds',
      fees: 0,
      value: bondsValue,
    },
  ];

  return fromInvestments({
    investments,
  });
}
