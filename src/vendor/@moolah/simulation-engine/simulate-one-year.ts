import _ from 'lodash';
import { inflationFromCpi } from '../../@moolah/lib';
import { YearData } from '../../computed-market-data/types';
import withdrawal from './withdrawal';
import adjustPortfolioInvestment from './adjust-portfolio-investment';
import {
  YearResult,
  WithdrawalStrategies,
  Portfolio,
  AdditionalWithdrawals,
} from './types';

interface SimulateOneYearOptions {
  yearNumber: number;
  year: number;
  yearsRemaining: number;
  isFirstYear: boolean;

  rebalancePortfolioAnnually: boolean;
  startPortfolio: Portfolio;

  withdrawalConfiguration: any;
  withdrawalMethod: WithdrawalStrategies;
  additionalWithdrawalsForYear: AdditionalWithdrawals;
  additionalIncomeForYear: AdditionalWithdrawals;

  previousResults: YearResult;
  yearMarketData: YearData;

  firstYearCpi: number;
  firstYearStartPortfolio: Portfolio;
}

export default function simulateOneYear({
  yearNumber,
  year,
  yearsRemaining,
  rebalancePortfolioAnnually,
  isFirstYear,
  startPortfolio,
  // TODO: this can be undefined
  previousResults,
  yearMarketData,
  firstYearCpi,
  withdrawalMethod,
  withdrawalConfiguration,
  firstYearStartPortfolio,
  additionalWithdrawalsForYear,
  additionalIncomeForYear,
}: SimulateOneYearOptions): YearResult | null {
  const yearStartValue = startPortfolio.totalValue;

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
    firstYearStartPortfolio.investments,
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
