import _ from 'lodash';
import spending from './spending';
import inflationFromCpi from '../market-data/inflation-from-cpi';
import marketDataByYear from '../market-data/market-data-by-year';
import {
  SpendingPlan,
  InvestmentType,
  SpendingMethods,
} from './run-simulations-interfaces';

const marketData = marketDataByYear();
const allYears = Object.keys(marketData);
const lastSupportedYear = Number(allYears[allYears.length - 1]);

// This maps an investment type to the key on marketData that
// represents its changes in a given year
const investmentTypeToGrowthMap = {
  [InvestmentType.equity]: 'stockMarketGrowth',
  [InvestmentType.bonds]: 'none',
};

interface PortfolioInvestment {
  percentage: number;
  type: InvestmentType;
  fees: number;
  value: number;
  annualGrowthAmount?: number;
}

interface RunSimulationOptions {
  startYear: number;
  duration: number;
  rebalancePortfolioAnnually: boolean;
  dipPercentage: number;
  spendingPlan: SpendingPlan;
  portfolio: {
    totalValue: number;
    investments: Array<PortfolioInvestment>;
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
  const firstYearCpi = firstYearMarketData.cpi;

  const endYearMarketData = _.find(marketData, {
    year: String(trueEndYear),
    month: '01',
  });
  const endYearCpi = endYearMarketData.cpi;

  const totalInflationOverPeriod = inflationFromCpi({
    startCpi: firstYearCpi,
    endCpi: endYearCpi,
  });

  const initialPortfolioValueInFinalYear =
    totalInflationOverPeriod * initialPortfolioValue;

  const resultsByYear: any[] = [];

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
      startCpi: firstYearCpi,
      endCpi: yearMarketData.cpi,
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
      (investment, index) => {
        if (notEnoughMoney) {
          return {
            ...investment,
            valueBeforeChange: investment.value,
            valueAfterWithdrawal: 0,
            growth: 0,
            dividends: 0,
            percentage: 0,
            value: 0,
          };
        }

        const previousYearInvestment =
          previousComputedData.portfolio.investments[index];

        // If we rebalance yearly, then we keep the original percentage from the previous year.
        // This assumes that the investor reinvests at the very beginning (or very end) of each year.
        const percentage = rebalancePortfolioAnnually
          ? initialPortfolio.investments[index].percentage
          : previousYearInvestment.percentage;

        // We assume that the total yearly withdrawal is divided evenly between the different
        // investments.
        const withdrawalAmount = percentage * totalWithdrawalAmount;
        const valueAfterWithdrawal =
          previousYearInvestment.value - withdrawalAmount;
        const growthKey = investmentTypeToGrowthMap[investment.type];
        const growthPercentage = yearMarketData[growthKey] || 0;
        const growth = valueAfterWithdrawal * growthPercentage;

        // This allows you to specify a fixed annual addition to this investment. This replaces
        // the "growth of cash" feature of cFIREsim.
        let annualGrowthAmount = investment.annualGrowthAmount
          ? investment.annualGrowthAmount
          : 0;

        let dividends =
          investment.type === 'equity'
            ? valueAfterWithdrawal * yearMarketData.dividendYields
            : 0;

        const valueWithGrowth =
          valueAfterWithdrawal + growth + annualGrowthAmount;

        // Fees aren't applied to dividends. This behavior matches cFIREsim.
        const fees = investment.fees * valueWithGrowth;

        // We factor everything in to get our end result for this investment
        const value = valueWithGrowth + dividends - fees;

        return {
          ...investment,
          percentage,
          growth,
          fees,
          dividends,
          valueBeforeChange: investment.value,
          valueAfterWithdrawal,
          valueWithGrowth,
          value,
        };
      }
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
