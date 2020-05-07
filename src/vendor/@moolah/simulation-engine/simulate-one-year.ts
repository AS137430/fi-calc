import _ from 'lodash';
import adjustPortfolioInvestment from './utils/adjust-portfolio-investment';
import {
  YearMarketData,
  YearResult,
  Portfolio,
  AdditionalWithdrawalsInput,
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

  withdrawalAmount: number;
  cumulativeInflationSinceFirstYear: number;
  cpi: number;
}

export default function simulateOneYear({
  yearNumber,
  year,

  rebalancePortfolioAnnually,
  startPortfolio,

  additionalWithdrawalsForYear,
  additionalIncomeForYear,

  yearMarketData,

  firstYearStartPortfolio,

  cpi,
  withdrawalAmount,
  cumulativeInflationSinceFirstYear,
}: SimulateOneYearOptions): YearResult | null {
  const yearStartValue = startPortfolio.totalValue;
  const additionalIncomeAmount = additionalIncomeForYear.reduce(
    (result, withdrawal) => {
      if (!withdrawal.inflationAdjusted) {
        return result + withdrawal.value;
      } else {
        return result + withdrawal.value * cumulativeInflationSinceFirstYear;
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
    firstYearStartPortfolio.investments,
    (investment, index) =>
      adjustPortfolioInvestment({
        portfolioValueBeforeMarketChanges,
        investment,
        index: Number(index),
        isOutOfMoneyAtEnd,
        startPortfolio,
        rebalancePortfolioAnnually,
        firstYearStartPortfolio,
        yearMarketData,
      })
  );

  const endValue = _.reduce(
    adjustedInvestmentValues,
    (result, investment) => result + investment.value,
    0
  );

  const endValueInFirstYearDollars = Number(
    (endValue / cumulativeInflationSinceFirstYear).toFixed(2)
  );

  const totalWithdrawalAmountInFirstYearDollars = Number(
    (totalWithdrawalAmount / cumulativeInflationSinceFirstYear).toFixed(2)
  );

  const endPortfolio = {
    totalValueInFirstYearDollars: endValueInFirstYearDollars,
    totalValue: endValue,
    investments: adjustedInvestmentValues,
  };

  return {
    year,
    month: 1,
    yearNumber,
    isOutOfMoneyAtEnd,
    marketData: yearMarketData,
    startCpi: cpi,
    cumulativeInflationSinceFirstYear,
    totalWithdrawalAmount,
    baseWithdrawalAmount,
    additionalWithdrawalAmount,
    totalWithdrawalAmountInFirstYearDollars,
    startPortfolio,
    endPortfolio,
  };
}
