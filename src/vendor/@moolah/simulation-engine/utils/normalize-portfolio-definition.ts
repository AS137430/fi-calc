import _ from 'lodash';
import { PortfolioDefinition, PortfolioInvestment } from '../types';

interface FromTotalAndPercentagesOptions {
  totalValue: number;
  investments: PortfolioInvestment[];
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
    // TODO: this is wrong!
    totalValueInFirstYearDollars: NaN,
  };
}

interface FromInvestmentsOptions {
  investments: Omit<PortfolioInvestment, 'percentage'>[];
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
    // TODO: this is wrong!
    totalValueInFirstYearDollars: NaN,
  };
}
