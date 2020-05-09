import _ from 'lodash';
import adjustPortfolioInvestment from './utils/adjust-portfolio-investment';
import {
  YearMarketData,
  YearResult,
  Portfolio,
  AdditionalWithdrawalsInput,
  PortfolioDefinition,
  PortfolioInvestment,
} from './types';

interface SimulateOneYearOptions {
  yearNumber: number;
  year: number;

  rebalancePortfolioAnnually: boolean;
  startPortfolio: Portfolio;

  additionalWithdrawalsForYear: AdditionalWithdrawalsInput;
  additionalIncomeForYear: AdditionalWithdrawalsInput;

  yearMarketData: YearMarketData;

  firstYearStartPortfolio: Portfolio;
  portfolioDefinition: PortfolioDefinition;

  withdrawalAmount: number;
  cumulativeInflationSinceFirstYear: number;
  endCumulativeInflationSinceFirstYear: number;
  cpi: number;
  endCpi: number;
}

export default function simulateOneYear({
  yearNumber,
  year,

  rebalancePortfolioAnnually,
  startPortfolio,
  portfolioDefinition,

  additionalWithdrawalsForYear,
  additionalIncomeForYear,

  yearMarketData,

  firstYearStartPortfolio,

  cpi,
  withdrawalAmount,
  cumulativeInflationSinceFirstYear,
  endCumulativeInflationSinceFirstYear,
}: SimulateOneYearOptions): YearResult {
  const yearStartValue = startPortfolio.totalValue;
  const additionalIncomeAmount = additionalIncomeForYear.reduce(
    (result, income) => {
      if (!income.inflationAdjusted) {
        return result + income.value;
      } else {
        // NOTE: using this inflation value implicitly means that all of the additional income occurs
        // in one lump sum at the start of the year, at the same time that the withdrawals
        // are made.
        // This makes it easier to reason about additional income/withdrawals by having them "cancel" one another
        // out dollar-for-dollar, even if folks may be expecting to earn income over the course of the year (in which
        // case we would need to use a different value of inflation)
        // I feel justified in doing this because:
        //   1. inflation is typically small year-to-year, and especially month-to-month
        //   2. the conceptual complexity of having it work any other way is huge
        return result + income.value * cumulativeInflationSinceFirstYear;
      }
    },
    0
  );

  const uncappedAdditionalWithdrawalAmount = additionalWithdrawalsForYear.reduce(
    (result, withdrawal) => {
      if (!withdrawal.inflationAdjusted) {
        return result + withdrawal.value;
      } else {
        return result + withdrawal.value * cumulativeInflationSinceFirstYear;
      }
    },
    0
  );

  const availableFundsToWithdraw = yearStartValue + additionalIncomeAmount;
  const totalWithdrawalAmount = Math.min(
    withdrawalAmount + uncappedAdditionalWithdrawalAmount,
    availableFundsToWithdraw
  );

  const baseWithdrawalAmount = Math.min(
    withdrawalAmount,
    availableFundsToWithdraw
  );

  const additionalWithdrawalAmount =
    totalWithdrawalAmount - baseWithdrawalAmount;

  const portfolioValueBeforeMarketChanges =
    yearStartValue + additionalIncomeAmount - totalWithdrawalAmount;
  const isOutOfMoneyAtEnd = portfolioValueBeforeMarketChanges === 0;

  let adjustedInvestmentValues = _.map(
    portfolioDefinition.investments,
    (investment, index) =>
      adjustPortfolioInvestment({
        portfolioValueBeforeMarketChanges,
        investment,
        index: Number(index),
        endCumulativeInflationSinceFirstYear,
        isOutOfMoneyAtEnd,
        startPortfolio,
        yearMarketData,
      })
  );

  const endValue = _.reduce(
    adjustedInvestmentValues,
    (result, investment) => result + investment.value,
    0
  );

  const newInvestmentValues: PortfolioInvestment[] = _.map(
    adjustedInvestmentValues,
    (investment, index) => {
      if (!rebalancePortfolioAnnually) {
        return {
          ...investment,
          rebalanceDelta: 0,
          percentage: endValue > 0 ? investment.value / endValue : 0,
        };
      } else {
        const percentage =
          firstYearStartPortfolio.investments[index].percentage;
        const value = Number((endValue * percentage).toFixed(2));
        const rebalanceDelta = Number((value - investment.value).toFixed(2));

        return {
          ...investment,
          rebalanceDelta,
          percentage,
          value,
          valueInFirstYearDollars: Number(
            (value / endCumulativeInflationSinceFirstYear).toFixed(2)
          ),
        };
      }
    }
  );

  const endValueInFirstYearDollars = Number(
    (endValue / endCumulativeInflationSinceFirstYear).toFixed(2)
  );

  const totalWithdrawalAmountInFirstYearDollars = Number(
    (totalWithdrawalAmount / cumulativeInflationSinceFirstYear).toFixed(2)
  );

  const endPortfolio = {
    totalValueInFirstYearDollars: endValueInFirstYearDollars,
    totalValue: endValue,
    investments: newInvestmentValues,
  };

  return {
    year,
    month: 1,
    yearNumber,
    isOutOfMoneyAtEnd,
    marketData: yearMarketData,
    startCpi: cpi,
    cumulativeInflationSinceFirstYear,
    endCumulativeInflationSinceFirstYear,
    totalWithdrawalAmount,
    baseWithdrawalAmount,
    additionalWithdrawalAmount,
    additionalIncomeAmount,
    totalWithdrawalAmountInFirstYearDollars,
    startPortfolio,
    endPortfolio,
  };
}
