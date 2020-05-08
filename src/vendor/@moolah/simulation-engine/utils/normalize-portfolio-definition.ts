import _ from 'lodash';
import { PortfolioDefinition, PortfolioDefinitionInvestment } from '../types';

interface FromTotalAndPercentagesOptions {
  totalValue: number;
  investments: Omit<PortfolioDefinitionInvestment, 'value'>[];
}

export function fromTotalAndPercentages({
  totalValue,
  investments,
}: FromTotalAndPercentagesOptions): PortfolioDefinition {
  const newInvestments = _.map(investments, investment => {
    return {
      ...investment,
      value: investment.percentage * totalValue,
    };
  });

  return {
    investments: newInvestments,
    totalValue,
  };
}

interface FromInvestmentsOptions {
  investments: Omit<PortfolioDefinitionInvestment, 'percentage'>[];
}

export function fromInvestments({
  investments,
}: FromInvestmentsOptions): PortfolioDefinition {
  const totalValue = _.reduce(
    investments,
    (result, investment) => result + investment.value,
    0
  );

  const newInvestments = _.map(investments, investment => {
    return {
      ...investment,
      percentage: investment.value / totalValue,
    };
  });

  return {
    investments: newInvestments,
    totalValue,
  };
}
