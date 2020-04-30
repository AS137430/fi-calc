import _ from 'lodash';
import withdrawal from './withdrawal';
import adjustPortfolioInvestment from './adjust-portfolio-investment';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import {
  YearResult,
  MarketData,
  WithdrawalStrategies,
  Portfolio,
  DipObject,
  AdditionalWithdrawals,
  ResultsByYear,
} from './run-simulations-interfaces';

interface SimulateOneYearOptions {
  startYear: number;
  yearsRemaining: number;
  rebalancePortfolioAnnually: boolean;
  isFirstYear: boolean;
  year: number;
  previousResults: YearResult;
  resultsByYear: ResultsByYear;
  marketData: MarketData;
  dipThreshold: number;
  firstYearCpi: number;
  didDip: boolean;
  lowestValue: number;
  withdrawalConfiguration: any;
  firstYearStartPortfolio: Portfolio;
  portfolio: Portfolio;
  withdrawalMethod: WithdrawalStrategies;
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
  resultsByYear,
  marketData,
  firstYearCpi,
  withdrawalMethod,
  withdrawalConfiguration,
  didDip,
  lowestValue,
  dipThreshold,
  firstYearStartPortfolio,
  portfolio,
  lowestSuccessfulDip,
  additionalWithdrawalsForYear,
  additionalIncomeForYear,
}: SimulateOneYearOptions): YearResult | null {
  const startPortfolio = isFirstYear
    ? firstYearStartPortfolio
    : resultsByYear[n - 1].endPortfolio;

  const yearStartValue = startPortfolio.totalValue;

  const yearMarketData = marketData[year];
  const currentCpi = Number(yearMarketData.cpi);

  const cumulativeInflationSinceFirstYear = inflationFromCpi({
    startCpi: Number(firstYearCpi),
    endCpi: currentCpi,
  });

  const withdrawalAmount = withdrawal[withdrawalMethod]({
    ...withdrawalConfiguration,
    previousResults,
    firstYearStartPortfolio,
    isFirstYear,
    yearMarketData,
    yearsRemaining,
    firstYearCpi: Number(firstYearCpi),
    cpi: currentCpi,
    portfolioTotalValue: yearStartValue,
    inflation: cumulativeInflationSinceFirstYear,
  });

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
    portfolio.investments,
    (investment, index) =>
      adjustPortfolioInvestment({
        portfolioValueBeforeMarketChanges,
        investment,
        index,
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
    isOutOfMoneyAtEnd,
    marketData: yearMarketData,
    startCpi: currentCpi,
    cumulativeInflationSinceFirstYear,
    totalWithdrawalAmount,
    baseWithdrawalAmount,
    additionalWithdrawalAmount,
    totalWithdrawalAmountInFirstYearDollars,
    startPortfolio,
    endPortfolio,
  };
}
