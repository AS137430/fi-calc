import _ from 'lodash';
import spending from './spending';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import marketDataByYear from '../market-data/market-data-by-year';
import {
  Portfolio,
  PortfolioInvestment,
  SpendingPlan,
  SpendingMethods,
} from './run-simulations-interfaces';
import adjustPortfolioInvestment from './adjust-portfolio-investment';

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

interface AdjustedInvestment extends PortfolioInvestment {
  valueBeforeChange: number;
  valueAfterWithdrawal: number;
  growth: number;
  dividends: number;
  percentage: number;
  value: number;
}

interface YearResult {
  year: number;
  marketData: any;
  computedData: {
    cumulativeInflation: number;
    totalWithdrawalAmount: number;
    totalWithdrawalAmountInFirstYearDollars: number;
    portfolio: {
      totalValueInFirstYearDollars: number;
      totalValue: number;
      investments: AdjustedInvestment[];
    };
  };
}

function getSpendingMethod(
  spendingStrategy: string,
  inflationAdjustedFirstYearWithdrawal: boolean
): SpendingMethods {
  if (spendingStrategy === 'portfolioPercent') {
    return SpendingMethods.portfolioPercent;
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
  } else {
    spendingConfiguration = {
      firstYearWithdrawal: Number(firstYearWithdrawal),
    };
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
  let lowestSuccessfulDip = {
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

  _.times(duration, n => {
    const isFirstYear = n === 0;
    const year = Number(startYear) + n;
    const nextYear = year + 1;
    const previousResults = resultsByYear[n - 1];

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
    const nextYearMarketData = marketData[nextYear];

    // If we have no data for this year, then we have nothing to return.
    // Likewise, if there is no data for _next_ year, then this year is the
    // last datapoint in our set, so it cannot be used.
    if (!yearMarketData || !nextYearMarketData) {
      return null;
    }

    const cumulativeInflation = inflationFromCpi({
      startCpi: Number(firstYearCpi),
      endCpi: Number(yearMarketData.cpi),
    });

    // For now, we use a simple inflation-adjusted withdrawal approach
    let totalWithdrawalAmount = spending[spendingMethod]({
      ...spendingConfiguration,
      portfolioTotalValue: yearStartValue,
      inflation: cumulativeInflation,
    });

    const notEnoughMoney = totalWithdrawalAmount > yearStartValue;

    if (notEnoughMoney) {
      totalWithdrawalAmount = yearStartValue;
    }

    let adjustedInvestmentValues = _.map(
      portfolio.investments,
      (investment, index) => adjustPortfolioInvestment({
        investment,
        index,
        notEnoughMoney,
        previousComputedData,
        rebalancePortfolioAnnually,
        initialPortfolio,
        totalWithdrawalAmount,
        yearMarketData
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

    // We only compute `isFailed` if we didn't already compute it as true before.
    if (!isFailed) {
      isFailed = endValue === 0;
      yearFailed = year;
    }

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

    resultsByYear.push({
      year,
      marketData: yearMarketData,
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
    });
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
