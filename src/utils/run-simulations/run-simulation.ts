import _ from 'lodash';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import marketDataByYear from '../market-data/market-data-by-year';
import {
  Portfolio,
  WithdrawalPlan,
  SpendingMethods,
  YearResult,
  DipObject
} from './run-simulations-interfaces';
import simulateOneYear from './simulate-one-year';

const marketData = marketDataByYear();
const allYears = Object.keys(marketData);
const lastSupportedYear = Number(allYears[allYears.length - 1]);

const marketDataCape = _.map(marketData, val => Number(val.cape)).filter(v => !Number.isNaN(v));
const avgMarketDataCape = _.reduce(marketDataCape, (result, current) => result + current, 0) / marketDataCape.length;

interface RunSimulationOptions {
  startYear: number;
  duration: number;
  rebalancePortfolioAnnually: boolean;
  dipPercentage: number;
  withdrawalPlan: WithdrawalPlan;
  portfolio: Portfolio;
}

function getSpendingMethod(
  withdrawalStrategy: string,
  inflationAdjustedFirstYearWithdrawal: boolean
): SpendingMethods {
  if (withdrawalStrategy === 'portfolioPercent') {
    return SpendingMethods.portfolioPercent;
  } else if (withdrawalStrategy === 'gk') {
    return SpendingMethods.guytonKlinger;
  } else if (withdrawalStrategy === '95percent') {
    return SpendingMethods.ninetyFivePercentRule;
  } else if (withdrawalStrategy === 'capeBased') {
    return SpendingMethods.capeBased;
  }

  return inflationAdjustedFirstYearWithdrawal
    ? SpendingMethods.inflationAdjusted
    : SpendingMethods.notInflationAdjusted;
}

// A simulation is one single possible retirement calculation. Given a start year, a "duration,"
// which is an integer number of years, and initial portfolio information,
// it computes the changes to that portfolio over time.
export default function runSimulation(options: RunSimulationOptions) {
  const {
    startYear,
    duration,
    portfolio,
    rebalancePortfolioAnnually,
    dipPercentage,
    withdrawalPlan,
  } = options;

  const {
    annualWithdrawal,
    inflationAdjustedFirstYearWithdrawal,
    withdrawalStrategy: withdrawalStrategyObject,
    percentageOfPortfolio: percentPercentageOfPortfolio,
    minWithdrawalLimit,
    maxWithdrawalLimit,
    minWithdrawalLimitEnabled,
    maxWithdrawalLimitEnabled,
    gkInitialSpending,
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
  } = withdrawalPlan;
  const firstYearWithdrawal = annualWithdrawal;
  const withdrawalStrategy = withdrawalStrategyObject.key;
  const percentageOfPortfolio = percentPercentageOfPortfolio / 100;

  let withdrawalConfiguration: any = {};

  type YearFailed = number | null;

  const withdrawalMethod = getSpendingMethod(
    withdrawalStrategy,
    inflationAdjustedFirstYearWithdrawal
  );

  const baseWithdrawalConfig = {
    minWithdrawal: minWithdrawalLimitEnabled ? minWithdrawalLimit : 0,
      maxWithdrawal: maxWithdrawalLimitEnabled
        ? maxWithdrawalLimit
        : Number.MAX_SAFE_INTEGER
  }

  if (withdrawalStrategy === 'portfolioPercent') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      percentageOfPortfolio,
    };
  } else if (withdrawalStrategy === 'constantWithdrawal') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      firstYearWithdrawal: Number(firstYearWithdrawal),
    };
  } else if (withdrawalStrategy === 'gk') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      gkInitialSpending: gkInitialSpending,
      gkWithdrawalUpperLimit: gkWithdrawalUpperLimit,
      gkWithdrawalLowerLimit: gkWithdrawalLowerLimit,
      gkUpperLimitAdjustment: gkUpperLimitAdjustment,
      gkLowerLimitAdjustment: gkLowerLimitAdjustment,
      gkIgnoreLastFifteenYears: gkIgnoreLastFifteenYears,
      gkModifiedWithdrawalRule: gkModifiedWithdrawalRule
    }
  } else if (withdrawalStrategy === '95percent') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      ninetyFiveInitialRate,
      ninetyFivePercentage
    };
  } else if (withdrawalStrategy === 'capeBased') {
    withdrawalConfiguration = {
      ...baseWithdrawalConfig,
      avgMarketDataCape,
      capeWithdrawalRate,
      capeWeight
    }
  }

  const initialPortfolioValue = portfolio.totalValue;
  const initialPortfolio = portfolio;

  const dipThreshold = dipPercentage * initialPortfolioValue;

  const endYear = startYear + duration - 1;
  const trueEndYear = Math.min(endYear, lastSupportedYear);

  // This Boolean represents whether this is simulation contains the entire
  // duration or not.
  const isComplete = startYear + duration <= lastSupportedYear;
  const firstYearMarketData = _.find(marketData, {
    year: startYear,
    month: 1,
  });

  // TODO: use the average CPI instead of 0
  const firstYearCpi = firstYearMarketData ? firstYearMarketData.cpi : 0;

  const endYearMarketData = _.find(marketData, {
    year: trueEndYear,
    month: 1,
  });
  const endYearCpi = endYearMarketData?.cpi;

  const totalInflationOverPeriod = inflationFromCpi({
    startCpi: Number(firstYearCpi),
    endCpi: Number(endYearCpi),
  });

  const initialPortfolioValueInFinalYear =
    totalInflationOverPeriod * initialPortfolioValue;

  const resultsByYear: YearResult[] = [];

  // Whether or not this simulation "failed," where failure is defined as the portfolio
  // value being equal to or less than 0.
  let isFailed = false;
  let didDip = false;
  let lowestValue = Infinity;
  let lowestSuccessfulDip:DipObject = {
    year: 0,
    value: Infinity,
    startYear: 0,
  };
  let yearFailed:YearFailed = null;

  // This can be used to simulate a "previous" year for the 0th year,
  // simplifying the logic below.
  const initialComputedData = {
    cumulativeInflation: 1,
    withdrawalAmount: 0,
    naiveEndValue: initialPortfolioValue,
    realisticEndValue: initialPortfolioValue,
    investmentGains: 0,
    dividendGains: 0,
    portfolio,
  };

  // Might be faster to make this a map of `resultsByYear`?
  _.times(duration, n => {
    const isFirstYear = n === 0;
    const year = Number(startYear) + n;
    const previousResults = resultsByYear[n - 1];
    const yearsRemaining = duration - n;

    const yearResult = simulateOneYear({
      n,
      yearsRemaining,
      startYear,
      isFirstYear,
      year,
      previousResults,
      rebalancePortfolioAnnually,
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
      lowestSuccessfulDip
    });

    if (yearResult !== null) {
      if (yearResult.isOutOfMoney) {
        isFailed = true;

        if (yearFailed === null) {
          yearFailed = year;
        }
      }

      resultsByYear.push(yearResult);
    }
  });

  const lastYear = resultsByYear[resultsByYear.length - 1];

  const finalYearPortfolio = lastYear.computedData.portfolio;
  const finalValue = finalYearPortfolio.totalValue;

  const percentOfChange =
    finalYearPortfolio.totalValueInFirstYearDollars /
    initialPortfolioValueInFinalYear;

  let numberOfSuccessfulYears = duration;
  if (yearFailed) {
    numberOfSuccessfulYears = yearFailed - startYear;
  }

  const minWithdrawalYearInFirstYearDollars = _.minBy(
    resultsByYear,
    year => year.computedData.totalWithdrawalAmountInFirstYearDollars
  );

  const minPortfolioYearInFirstYearDollars = _.minBy(
    resultsByYear,
    year => year.computedData.portfolio.totalValueInFirstYearDollars
  );

  const finalRatio =
    lastYear.computedData.portfolio.totalValueInFirstYearDollars /
    initialPortfolioValue;

  let status;
  if (finalRatio === 0) {
    status = 'FAILED';
  } else if (finalRatio < 0.35) {
    status = 'WARNING';
  } else {
    status = 'OK';
  }

  return {
    initialPortfolioValue,
    startYear,
    duration,
    status,
    endYear,
    isComplete,
    resultsByYear,
    isFailed,
    yearFailed,
    numberOfSuccessfulYears,
    didDip,
    lowestSuccessfulDip,
    finalValue,
    percentOfChange,
    minWithdrawalYearInFirstYearDollars,
    minPortfolioYearInFirstYearDollars,
  };
}
