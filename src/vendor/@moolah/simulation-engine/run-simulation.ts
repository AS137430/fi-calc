import _ from 'lodash';
import { inflationFromCpi } from '../../@moolah/lib';
import {
  Portfolio,
  WithdrawalStrategy,
  WithdrawalStrategies,
  YearResult,
  AdditionalWithdrawals,
  Simulation,
  MarketDataInput
} from './types';
import simulateOneYear from './simulate-one-year';

interface RunSimulationOptions {
  simulationNumber: number;
  startYear: number;
  duration: number;
  rebalancePortfolioAnnually: boolean;
  withdrawalStrategy: WithdrawalStrategy;
  portfolio: Portfolio;
  additionalWithdrawals: AdditionalWithdrawals;
  additionalIncome: AdditionalWithdrawals;
  marketData: MarketDataInput
}

// TODO: type these and make them the same
function getWithdrawalMethod(
  withdrawalStrategyName: string,
  inflationAdjustedFirstYearWithdrawal: boolean
): WithdrawalStrategies {
  if (withdrawalStrategyName === 'portfolioPercent') {
    return WithdrawalStrategies.portfolioPercent;
  } else if (withdrawalStrategyName === 'gk') {
    return WithdrawalStrategies.guytonKlinger;
  } else if (withdrawalStrategyName === '95percent') {
    return WithdrawalStrategies.ninetyFivePercentRule;
  } else if (withdrawalStrategyName === 'capeBased') {
    return WithdrawalStrategies.capeBased;
  }

  return inflationAdjustedFirstYearWithdrawal
    ? WithdrawalStrategies.inflationAdjusted
    : WithdrawalStrategies.notInflationAdjusted;
}

// A simulation is one single possible retirement calculation. Given a start year, a "duration,"
// which is an integer number of years, and initial portfolio information,
// it computes the changes to that portfolio over time.
export default function runSimulation(options: RunSimulationOptions):Simulation {
  const {
    simulationNumber,
    startYear,
    duration,
    portfolio,
    rebalancePortfolioAnnually,
    withdrawalStrategy,
    additionalWithdrawals,
    additionalIncome,
    marketData
  } = options;

  const {
    avgMarketDataCape,
    lastSupportedYear,
    byYear
  } = marketData;

  const {
    annualWithdrawal,
    inflationAdjustedFirstYearWithdrawal,
    withdrawalStrategyName: withdrawalStrategyNameObject,
    percentageOfPortfolio: percentPercentageOfPortfolio,
    minWithdrawalLimit,
    maxWithdrawalLimit,
    minWithdrawalLimitEnabled,
    maxWithdrawalLimitEnabled,
    gkInitialWithdrawal,
    gkWithdrawalUpperLimit,
    gkWithdrawalLowerLimit,
    gkUpperLimitAdjustment,
    gkLowerLimitAdjustment,
    gkIgnoreLastFifteenYears,
    gkModifiedWithdrawalRule,

    ninetyFiveInitialRate,
    ninetyFivePercentage,

    capeWithdrawalRate,
    capeWeight
  } = withdrawalStrategy;
  const firstYearWithdrawal = annualWithdrawal;
  const withdrawalStrategyName = withdrawalStrategyNameObject.key;
  const percentageOfPortfolio = percentPercentageOfPortfolio / 100;

  let withdrawalConfiguration: any = {};

  type yearRanOutOfMoney = number | null;

  const withdrawalMethod = getWithdrawalMethod(
    withdrawalStrategyName,
    inflationAdjustedFirstYearWithdrawal
  );

  const baseWithdrawalConfig = {
    minWithdrawal: minWithdrawalLimitEnabled ? minWithdrawalLimit : 0,
      maxWithdrawal: maxWithdrawalLimitEnabled
        ? maxWithdrawalLimit
        : Number.MAX_SAFE_INTEGER
  }

  if (withdrawalStrategyName === 'portfolioPercent') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      percentageOfPortfolio,
    };
  } else if (withdrawalStrategyName === 'constantWithdrawal') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      firstYearWithdrawal: Number(firstYearWithdrawal),
    };
  } else if (withdrawalStrategyName === 'gk') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      gkInitialWithdrawal: gkInitialWithdrawal,
      gkWithdrawalUpperLimit: gkWithdrawalUpperLimit,
      gkWithdrawalLowerLimit: gkWithdrawalLowerLimit,
      gkUpperLimitAdjustment: gkUpperLimitAdjustment,
      gkLowerLimitAdjustment: gkLowerLimitAdjustment,
      gkIgnoreLastFifteenYears: gkIgnoreLastFifteenYears,
      gkModifiedWithdrawalRule: gkModifiedWithdrawalRule
    }
  } else if (withdrawalStrategyName === '95percent') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      ninetyFiveInitialRate,
      ninetyFivePercentage
    };
  } else if (withdrawalStrategyName === 'capeBased') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      avgMarketDataCape,
      capeWithdrawalRate,
      capeWeight
    }
  }

  const firstYearStartPortfolio = portfolio;
  const firstYearStartPortfolioValue = firstYearStartPortfolio.totalValue;

  const endYear = startYear + duration - 1;
  const trueEndYear = Math.min(endYear, lastSupportedYear);

  // This Boolean represents whether this is simulation contains the entire
  // duration or not.
  const isComplete = startYear + duration <= lastSupportedYear;
  const firstYearMarketData = _.find(byYear, {
    year: startYear,
    month: 1,
  });

  // TODO: use the average CPI instead of 0
  const firstYearCpi = firstYearMarketData ? firstYearMarketData.cpi : 0;

  const endYearMarketData = _.find(byYear, {
    year: trueEndYear,
    month: 1,
  });
  const endYearCpi = endYearMarketData?.cpi;

  const totalInflationOverPeriod = inflationFromCpi({
    startCpi: Number(firstYearCpi),
    endCpi: Number(endYearCpi),
  });

  const resultsByYear: YearResult[] = [];

  // Whether or not this simulation "failed," where failure is defined as the portfolio
  // value being equal to or less than 0.
  let ranOutOfMoney = false;
  let yearRanOutOfMoney:yearRanOutOfMoney = null;

  const numericStartYear = Number(startYear);

  // Might be faster to make this a map of `resultsByYear`?
  _.times(duration, yearNumber => {
    const isFirstYear = yearNumber === 0;
    const year = numericStartYear + yearNumber;
    const previousResults = resultsByYear[yearNumber - 1];
    const yearsRemaining = duration - yearNumber;

    const additionalWithdrawalsForYear = additionalWithdrawals.filter(withdrawal => {
      if (withdrawal.duration === 0) {
        return false;
      }

      const withdrawalStartYear = numericStartYear + withdrawal.startYear;
      const withdrawalEndYear = withdrawalStartYear + withdrawal.duration - 1;

      return year >= withdrawalStartYear && year <= withdrawalEndYear;
    });

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

    const yearResult = simulateOneYear({
      yearNumber,
      startPortfolio,
      yearsRemaining,
      isFirstYear,
      yearMarketData,
      year,
      previousResults,
      rebalancePortfolioAnnually,
      firstYearCpi,
      withdrawalMethod,
      withdrawalConfiguration,
      firstYearStartPortfolio,
      additionalWithdrawalsForYear,
      additionalIncomeForYear
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

  const minWithdrawalYearInFirstYearDollars = _.minBy(
    resultsByYear,
    year => year.totalWithdrawalAmountInFirstYearDollars
  );

  const minPortfolioYearInFirstYearDollars = _.minBy(
    resultsByYear,
    year => year.endPortfolio.totalValueInFirstYearDollars
  );

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
    minWithdrawalYearInFirstYearDollars,
    minPortfolioYearInFirstYearDollars,
  };
}
