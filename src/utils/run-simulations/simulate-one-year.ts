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
  firstYearCpi: string | undefined;
  didDip: boolean;
  lowestValue: number;
  withdrawalConfiguration: any;
  initialPortfolio: Portfolio;
  portfolio: Portfolio;
  withdrawalMethod: SpendingMethods;
  lowestSuccessfulDip: DipObject;
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

  // For now, we use a simple inflation-adjusted withdrawal approach
  let totalWithdrawalAmount = withdrawal[withdrawalMethod]({
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

  const notEnoughMoney = totalWithdrawalAmount > yearStartValue;

  if (notEnoughMoney) {
    totalWithdrawalAmount = yearStartValue;
  }

  let adjustedInvestmentValues = _.map(
    portfolio.investments,
    (investment, index) =>
      adjustPortfolioInvestment({
        investment,
        index,
        notEnoughMoney,
        previousComputedData,
        rebalancePortfolioAnnually,
        initialPortfolio,
        totalWithdrawalAmount,
        yearMarketData,
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
