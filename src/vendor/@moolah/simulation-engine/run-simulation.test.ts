import runSimulation from './run-simulation';
import { PortfolioDefinition } from './types';

function getBasicPortfolioDefinition(): PortfolioDefinition {
  return {
    totalValue: 1000000,
    investments: [
      {
        percentage: 1,
        type: 'equity',
        fees: 0.04,
        value: 1000000,
      },
    ],
  };
}

function getBasicMarketData() {
  return {
    byYear: {
      1930: {
        year: 1930,
        month: 1,
        cpi: 30,
        cape: 100,
        dividendYields: 0,
        bondsGrowth: 1,
        stockMarketGrowth: 1.04,
        none: 1,
      },
      1931: {
        year: 1931,
        month: 1,
        cpi: 35,
        cape: 105,
        dividendYields: 0,
        bondsGrowth: 1,
        stockMarketGrowth: 1.04,
        none: 1,
      },
      1932: {
        year: 1932,
        month: 1,
        cpi: 40,
        cape: 95,
        dividendYields: 0,
        bondsGrowth: 1,
        stockMarketGrowth: 1.04,
        none: 1,
      },
      1933: {
        year: 1933,
        month: 1,
        cpi: 45,
        cape: 100,
        dividendYields: 0,
        bondsGrowth: 1,
        stockMarketGrowth: 1.04,
        none: 1,
      },
    },
    lastSupportedYear: 1933,
    avgMarketDataCape: 110,
  };
}

describe('runSimulation', () => {
  it('should be a function', () => {
    expect(typeof runSimulation === 'function').toBe(true);
  });

  describe('custom withdrawal: constant dollar', () => {
    const marketData = getBasicMarketData();
    const portfolioDefinition = getBasicPortfolioDefinition();

    const sim = runSimulation({
      yearlyWithdrawal() {
        return 40000;
      },
      simulationNumber: 1,
      startYear: 1930,
      duration: 2,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalWithdrawals: [],
      additionalIncome: [],
      marketData: marketData,
    });

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1931,
      duration: 2,
      isComplete: true,
      ranOutOfMoney: false,
      yearRanOutOfMoney: null,
      numberOfYearsWithMoneyInPortfolio: 2,
      lastYearEndPortfolioValue: 3603581.34,
      totalInflationOverPeriod: 1.1666666666666667,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 30,
          cumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: {
            totalValue: 1000000,
            totalValueInFirstYearDollars: 1000000,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                dividendsAmount: 0,
                type: 'equity',
                growthAmount: 0,
                feesAmount: 0,
                value: 1000000,
                valueAfterWithdrawal: 1000000,
                valueBeforeChange: 1000000,
                valueWithGrowth: 1000000,
              },
            ],
          },
          endPortfolio: {
            totalValue: 1880064,
            totalValueInFirstYearDollars: 1880064,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                type: 'equity',
                growthAmount: 998400,
                dividendsAmount: 0,
                feesAmount: 78336,
                value: 1880064,
                valueAfterWithdrawal: 960000,
                valueBeforeChange: 1000000,
                valueWithGrowth: 1958400,
              },
            ],
          },
        },
        {
          year: 1931,
          month: 1,
          yearNumber: 1,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1931],
          startCpi: 35,
          cumulativeInflationSinceFirstYear: 1.1666666666666667,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 34285.71,
          startPortfolio: {
            totalValue: 1880064,
            totalValueInFirstYearDollars: 1880064,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                type: 'equity',
                growthAmount: 998400,
                dividendsAmount: 0,
                feesAmount: 78336,
                value: 1880064,
                valueAfterWithdrawal: 960000,
                valueBeforeChange: 1000000,
                valueWithGrowth: 1958400,
              },
            ],
          },
          endPortfolio: {
            investments: [
              {
                dividendsAmount: 0,
                feesAmount: 150149.2224,
                growthAmount: 1913666.56,
                percentage: 1,
                startingPercentage: 1,
                type: 'equity',
                value: 3603581.34,
                valueAfterWithdrawal: 1840064,
                valueBeforeChange: 1000000,
                valueWithGrowth: 3753730.56,
              },
            ],
            totalValue: 3603581.34,
            totalValueInFirstYearDollars: 3088784.01,
          },
        },
      ],
    });
  });
});
