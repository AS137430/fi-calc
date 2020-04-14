import _ from 'lodash';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import marketDataByYear from '../market-data/market-data-by-year';
import {
  Portfolio,
  SpendingPlan,
  SpendingMethods,
  YearResult,
  DipObject
} from './run-simulations-interfaces';
import simulateOneYear from './simulate-one-year';

const marketData = marketDataByYear();
const allYears = Object.keys(marketData);
const lastSupportedYear = Number(allYears[allYears.length - 1]);

interface RunSimulationOptions {
  startYear: number;
  duration: number;
  rebalancePortfolioAnnually: boolean;
  dipPercentage: number;
  spendingPlan: SpendingPlan;
  portfolio: Portfolio;
}

function getSpendingMethod(
  spendingStrategy: string,
  inflationAdjustedFirstYearWithdrawal: boolean
): SpendingMethods {
  if (spendingStrategy === 'portfolioPercent') {
    return SpendingMethods.portfolioPercent;
  } else if (spendingStrategy === 'gk') {
    return SpendingMethods.guytonKlinger;
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
    spendingPlan,
  } = options;

  const {
    annualSpending,
    inflationAdjustedFirstYearWithdrawal,
    spendingStrategy: spendingStrategyObject,
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
    gkIgnoreLastFifteenYears
  } = spendingPlan;
  const firstYearWithdrawal = annualSpending;
  const spendingStrategy = spendingStrategyObject.key;
  const percentageOfPortfolio = percentPercentageOfPortfolio / 100;

  let spendingConfiguration: any = {};

  const spendingMethod = getSpendingMethod(
    spendingStrategy,
    inflationAdjustedFirstYearWithdrawal
  );

  if (spendingStrategy === 'portfolioPercent') {
    spendingConfiguration = {
      // These are necessary for this computation...
      minWithdrawal: minWithdrawalLimitEnabled ? minWithdrawalLimit : 0,
      maxWithdrawal: maxWithdrawalLimitEnabled
        ? maxWithdrawalLimit
        : Number.MAX_SAFE_INTEGER,
      percentageOfPortfolio,
    };
  } else if (spendingStrategy === 'constantSpending') {
    spendingConfiguration = {
      firstYearWithdrawal: Number(firstYearWithdrawal),
    };
  } else if (spendingStrategy === 'gk') {
    spendingConfiguration = {
      gkInitialSpending: gkInitialSpending,
      gkWithdrawalUpperLimit: gkWithdrawalUpperLimit,
      gkWithdrawalLowerLimit: gkWithdrawalLowerLimit,
      gkUpperLimitAdjustment: gkUpperLimitAdjustment,
      gkLowerLimitAdjustment: gkLowerLimitAdjustment,
      gkIgnoreLastFifteenYears: gkIgnoreLastFifteenYears
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
    year: String(startYear),
    month: '01',
  });
  const firstYearCpi = firstYearMarketData?.cpi;

  const endYearMarketData = _.find(marketData, {
    year: String(trueEndYear),
    month: '01',
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
  let yearFailed = null;

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

  console.log('\n\nloop');
  // Might be faster to make this a map of `resultsByYear`?
  _.times(duration, n => {
    const isFirstYear = n === 0;
    const year = Number(startYear) + n;
    const previousResults = resultsByYear[n - 1];

    const yearResult = simulateOneYear({
      n,
      startYear,
      isFirstYear,
      year,
      previousResults,
      rebalancePortfolioAnnually,
      initialComputedData,
      resultsByYear,
      marketData,
      firstYearCpi,
      spendingMethod,
      spendingConfiguration,
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
