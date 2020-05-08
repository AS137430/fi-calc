import _ from 'lodash';
import { inflationFromCpi } from '../../@moolah/lib';
import {
  PortfolioDefinition,
  YearResult,
  AdditionalWithdrawalsInput,
  Simulation,
  MarketDataInput,
  WithdrawalFnOptions,
} from './types';
import simulateOneYear from './simulate-one-year';
import getFirstYearPortfolioFromDefinition from './utils/get-first-year-portfolio-from-definition';

interface RunSimulationOptions {
  yearlyWithdrawal(withdrawalOptions: WithdrawalFnOptions): number;
  simulationNumber: number;
  startYear: number;
  duration: number;
  rebalancePortfolioAnnually: boolean;
  portfolioDefinition: PortfolioDefinition;
  additionalWithdrawals: AdditionalWithdrawalsInput;
  additionalIncome: AdditionalWithdrawalsInput;
  marketData: MarketDataInput;
}

// A simulation is one single possible retirement calculation. Given a start year, a "duration,"
// which is an integer number of years, and initial portfolio information,
// it computes the changes to that portfolio over time.
export default function runSimulation(
  options: RunSimulationOptions
): Simulation {
  const {
    yearlyWithdrawal,
    simulationNumber,
    startYear,
    duration,
    portfolioDefinition,
    rebalancePortfolioAnnually,
    additionalWithdrawals,
    additionalIncome,
    marketData,
  } = options;

  const { lastSupportedYear, byYear } = marketData;

  type yearRanOutOfMoney = number | null;

  const firstYearStartPortfolio = getFirstYearPortfolioFromDefinition(
    portfolioDefinition
  );
  const firstYearStartPortfolioValue = firstYearStartPortfolio.totalValue;

  const endYear = startYear + duration - 1;
  const trueEndYear = Math.min(endYear, lastSupportedYear);

  // This Boolean represents whether this is simulation contains the entire
  // duration or not.
  const isComplete = startYear + duration <= lastSupportedYear;
  const firstYearMarketData = byYear[startYear];

  // TODO: use the median CPI instead of 0
  const firstYearCpi = firstYearMarketData ? firstYearMarketData.startCpi : 1;

  const endYearMarketData = byYear[trueEndYear];

  // TODO: use the median CPI instead of 0
  const endYearCpi = endYearMarketData ? endYearMarketData.endCpi : 1;

  const totalInflationOverPeriod = inflationFromCpi({
    startCpi: firstYearCpi,
    endCpi: endYearCpi,
  });

  const resultsByYear: YearResult[] = [];

  // Whether or not this simulation "failed," where failure is defined as the portfolio
  // value being equal to or less than 0.
  let ranOutOfMoney = false;
  let yearRanOutOfMoney: yearRanOutOfMoney = null;

  const numericStartYear = Number(startYear);

  // Might be faster to make this a map of `resultsByYear`?
  _.times(duration, yearNumber => {
    const isFirstYear = yearNumber === 0;
    const year = numericStartYear + yearNumber;
    const previousResults = resultsByYear[yearNumber - 1];
    const yearsRemaining = duration - yearNumber;

    const additionalWithdrawalsForYear = additionalWithdrawals.filter(
      withdrawal => {
        if (withdrawal.duration === 0) {
          return false;
        }

        const withdrawalStartYear = numericStartYear + withdrawal.startYear;
        const withdrawalEndYear = withdrawalStartYear + withdrawal.duration - 1;

        return year >= withdrawalStartYear && year <= withdrawalEndYear;
      }
    );

    const additionalIncomeForYear = additionalIncome.filter(income => {
      if (income.duration === 0) {
        return false;
      }

      const incomeStartYear = numericStartYear + income.startYear;
      const incomeEndYear = incomeStartYear + income.duration - 1;

      return year >= incomeStartYear && year <= incomeEndYear;
    });

    const startPortfolio = isFirstYear
      ? firstYearStartPortfolio
      : resultsByYear[yearNumber - 1].endPortfolio;
    const yearMarketData = byYear[year];

    const currentCpi = yearMarketData.startCpi;
    const endCpi = yearMarketData.endCpi;

    const cumulativeInflationSinceFirstYear = inflationFromCpi({
      startCpi: firstYearCpi,
      endCpi: currentCpi,
    });

    const endCumulativeInflationSinceFirstYear = inflationFromCpi({
      startCpi: firstYearCpi,
      endCpi: endCpi,
    });

    const withdrawalAmount = yearlyWithdrawal({
      firstYearStartPortfolio,
      startPortfolio,
      simulationNumber,
      isFirstYear,
      year,
      month: 1,
      cumulativeInflation: cumulativeInflationSinceFirstYear,
      yearMarketData,
      yearsRemaining,
      previousResults,
      firstYearCpi,
    });

    const yearResult = simulateOneYear({
      yearNumber,
      startPortfolio,
      portfolioDefinition,
      yearMarketData,
      year,
      cpi: currentCpi,
      endCpi,
      rebalancePortfolioAnnually,
      cumulativeInflationSinceFirstYear,
      endCumulativeInflationSinceFirstYear,
      firstYearStartPortfolio,
      additionalWithdrawalsForYear,
      additionalIncomeForYear,
      withdrawalAmount,
    });

    if (yearResult !== null) {
      if (yearResult.isOutOfMoneyAtEnd) {
        ranOutOfMoney = true;

        if (yearRanOutOfMoney === null) {
          yearRanOutOfMoney = year;
        }
      }

      resultsByYear.push(yearResult);
    }
  });

  const lastYear = resultsByYear[resultsByYear.length - 1];

  const finalYearPortfolio = lastYear.endPortfolio;
  const lastYearEndPortfolioValue = finalYearPortfolio.totalValue;

  let numberOfYearsWithMoneyInPortfolio = duration;
  if (yearRanOutOfMoney) {
    numberOfYearsWithMoneyInPortfolio = yearRanOutOfMoney - startYear;
  }

  return {
    simulationNumber,
    firstYearStartPortfolioValue,
    startYear,
    endYear,
    duration,
    isComplete,
    resultsByYear,
    ranOutOfMoney,
    yearRanOutOfMoney,
    numberOfYearsWithMoneyInPortfolio,
    lastYearEndPortfolioValue,
    totalInflationOverPeriod,
  };
}
