import _ from 'lodash';
import withdrawal from './withdrawal';
import adjustPortfolioInvestment from './adjust-portfolio-investment';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import {
  YearResult,
  MarketData,
  SpendingMethods,
  Portfolio,
  DipObject,
  AdditionalWithdrawals,
} from './run-simulations-interfaces';

interface SimulateOneYearOptions {
  startYear: number;
  yearsRemaining: number;
  rebalancePortfolioAnnually: boolean;
  isFirstYear: boolean;
  year: number;
  previousResults: YearResult;
  initialComputedData: any;
  resultsByYear: any;
  marketData: MarketData;
  dipThreshold: number;
  firstYearCpi: number;
  didDip: boolean;
  lowestValue: number;
  withdrawalConfiguration: any;
  initialPortfolio: Portfolio;
  portfolio: Portfolio;
  withdrawalMethod: SpendingMethods;
  lowestSuccessfulDip: DipObject;
  additionalWithdrawalsForYear: AdditionalWithdrawals;
  additionalIncomeForYear: AdditionalWithdrawals;
  n: number;
}

export default function simulateOneYear({
  n,
  yearsRemaining,
  startYear,
  rebalancePortfolioAnnually,
  isFirstYear,
  year,
  previousResults,
  initialComputedData,
  resultsByYear,
  marketData,
  firstYearCpi,
  withdrawalMethod,
  withdrawalConfiguration,
  didDip,
  lowestValue,
  dipThreshold,
  initialPortfolio,
  portfolio,
  lowestSuccessfulDip,
  additionalWithdrawalsForYear,
  additionalIncomeForYear,
}: SimulateOneYearOptions): YearResult | null {
  // If we had no results for last year, then we can't compute anything
  // for this year either.
  if (!isFirstYear && !previousResults) {
    return null;
  }

  const previousComputedData = isFirstYear
    ? initialComputedData
    : resultsByYear[n - 1].computedData;

  const yearStartValue = previousComputedData.portfolio.totalValue;

  const yearMarketData = marketData[year];
  const currentCpi = Number(yearMarketData.cpi);

  const cumulativeInflation = inflationFromCpi({
    startCpi: Number(firstYearCpi),
    endCpi: currentCpi,
  });

  const withdrawalPlanWithdrawal = withdrawal[withdrawalMethod]({
    ...withdrawalConfiguration,
    previousResults,
    initialPortfolio,
    isFirstYear,
    yearMarketData,
    yearsRemaining,
    firstYearCpi: Number(firstYearCpi),
    cpi: currentCpi,
    portfolioTotalValue: yearStartValue,
    inflation: cumulativeInflation,
  });

  const additionalIncomeAmount = additionalIncomeForYear.reduce(
    (result, withdrawal) => {
      if (!withdrawal.inflationAdjusted) {
        return result + withdrawal.value;
      } else {
        return result + withdrawal.value * cumulativeInflation;
      }
    },
    0
  );

  const additionalWithdrawalAmount = additionalWithdrawalsForYear.reduce(
    (result, withdrawal) => {
      if (!withdrawal.inflationAdjusted) {
        return result + withdrawal.value;
      } else {
        return result + withdrawal.value * cumulativeInflation;
      }
    },
    0
  );

  let totalWithdrawalAmount =
    withdrawalPlanWithdrawal + additionalWithdrawalAmount;

  const availableFundsToWithdraw = yearStartValue + additionalIncomeAmount;
  const notEnoughMoney = totalWithdrawalAmount > availableFundsToWithdraw;

  if (notEnoughMoney) {
    totalWithdrawalAmount = availableFundsToWithdraw;
  }

  let adjustedInvestmentValues = _.map(
    portfolio.investments,
    (investment, index) =>
      adjustPortfolioInvestment({
        startYear,
        investment,
        index,
        notEnoughMoney,
        previousComputedData,
        rebalancePortfolioAnnually,
        initialPortfolio,
        totalWithdrawalAmount,
        yearMarketData,
        additionalIncomeAmount,
      })
  );

  const endValue = _.reduce(
    adjustedInvestmentValues,
    (result, investment) => result + investment.value,
    0
  );

  const endValueInFirstYearDollars = Number(
    (endValue / cumulativeInflation).toFixed(2)
  );

  const isOutOfMoney = endValue === 0;

  if (!didDip) {
    didDip = endValue <= dipThreshold;
  }

  if (endValue < lowestValue) {
    lowestValue = endValue;
  }

  if (didDip) {
    if (lowestValue < lowestSuccessfulDip.value) {
      lowestSuccessfulDip = {
        value: lowestValue,
        startYear,
        year,
      };
    }
  }

  const totalWithdrawalAmountInFirstYearDollars = Number(
    (totalWithdrawalAmount / cumulativeInflation).toFixed(2)
  );

  return {
    year,
    isOutOfMoney,
    marketData: yearMarketData,
    cpi: currentCpi,
    computedData: {
      cumulativeInflation,
      totalWithdrawalAmount,
      totalWithdrawalAmountInFirstYearDollars,
      portfolio: {
        totalValueInFirstYearDollars: endValueInFirstYearDollars,
        totalValue: endValue,
        investments: adjustedInvestmentValues,
      },
    },
  };
}
