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

describe('runSimulation', () => {
  it('no growth, no inflation, no fees', () => {
    const portfolioDefinition: PortfolioDefinition = {
      totalValue: 1000000,
      investments: [
        {
          percentage: 1,
          type: 'equity',
          fees: 0,
          value: 1000000,
        },
      ],
    };

    const marketData = {
      byYear: {
        1930: {
          year: 1930,
          month: 1,
          cpi: 30,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          cpi: 30,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1932: {
          year: 1932,
          month: 1,
          cpi: 30,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1933: {
          year: 1933,
          month: 1,
          cpi: 30,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
      },
      lastSupportedYear: 1933,
      avgMarketDataCape: 100,
    };

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
      marketData,
    });

    const expectedPortfolios = [
      {
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
            valueWithGrowth: 1000000,
          },
        ],
      },
      {
        totalValue: 960000,
        totalValueInFirstYearDollars: 960000,
        investments: [
          {
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 960000,
            valueAfterWithdrawal: 960000,
            valueWithGrowth: 960000,
          },
        ],
      },
      {
        investments: [
          {
            dividendsAmount: 0,
            feesAmount: 0,
            growthAmount: 0,
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            value: 920000,
            valueAfterWithdrawal: 920000,
            valueWithGrowth: 920000,
          },
        ],
        totalValue: 920000,
        totalValueInFirstYearDollars: 920000,
      },
    ];

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
      lastYearEndPortfolioValue: 920000,
      totalInflationOverPeriod: 1,
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
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
        {
          year: 1931,
          month: 1,
          yearNumber: 1,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1931],
          startCpi: 30,
          cumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[1],
          endPortfolio: expectedPortfolios[2],
        },
      ],
    });
  });

  it('no growth, 3% inflation, no fees', () => {
    const portfolioDefinition: PortfolioDefinition = {
      totalValue: 1000000,
      investments: [
        {
          percentage: 1,
          type: 'equity',
          fees: 0,
          value: 1000000,
        },
      ],
    };

    const marketData = {
      byYear: {
        1930: {
          year: 1930,
          month: 1,
          cpi: 100,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          cpi: 103,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1932: {
          year: 1932,
          month: 1,
          cpi: 106.09,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1933: {
          year: 1933,
          month: 1,
          cpi: 109.2727,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
      },
      lastSupportedYear: 1933,
      avgMarketDataCape: 100,
    };

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
      marketData,
    });

    const expectedPortfolios = [
      {
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
            valueWithGrowth: 1000000,
          },
        ],
      },
      {
        totalValue: 960000,
        totalValueInFirstYearDollars: 960000,
        investments: [
          {
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 960000,
            valueAfterWithdrawal: 960000,
            valueWithGrowth: 960000,
          },
        ],
      },
      {
        investments: [
          {
            dividendsAmount: 0,
            feesAmount: 0,
            growthAmount: 0,
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            value: 920000,
            valueAfterWithdrawal: 920000,
            valueWithGrowth: 920000,
          },
        ],
        totalValue: 920000,
        totalValueInFirstYearDollars: 893203.88,
      },
    ];

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
      lastYearEndPortfolioValue: 920000,
      totalInflationOverPeriod: 1.03,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
        {
          year: 1931,
          month: 1,
          yearNumber: 1,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1931],
          startCpi: 103,
          cumulativeInflationSinceFirstYear: 1.03,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          // 40,000 / 1.03 = 38834.95
          totalWithdrawalAmountInFirstYearDollars: 38834.95,
          startPortfolio: expectedPortfolios[1],
          endPortfolio: expectedPortfolios[2],
        },
      ],
    });
  });

  it('custom withdrawal: constant dollar', () => {
    const portfolioDefinition = getBasicPortfolioDefinition();

    const marketData = {
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
      marketData,
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
