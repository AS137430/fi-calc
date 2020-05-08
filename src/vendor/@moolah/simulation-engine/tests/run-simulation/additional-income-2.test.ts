import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('additional income, 2 years', () => {
  it('cannot save a failed portfolio', () => {
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
          startCpi: 30,
          endCpi: 30,
          inflationOverPeriod: 1,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 30,
          endCpi: 30,
          inflationOverPeriod: 1,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1932: {
          year: 1932,
          month: 1,
          startCpi: 30,
          endCpi: 30,
          inflationOverPeriod: 1,
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
        return 1500000;
      },
      simulationNumber: 1,
      startYear: 1930,
      duration: 2,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalWithdrawals: [],
      additionalIncome: [
        {
          name: '',
          value: 1000000,
          inflationAdjusted: false,
          duration: 1,
          startYear: 1,
        },
      ],
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
            valueInFirstYearDollars: 1000000,
            valueAfterWithdrawal: 1000000,
            valueWithGrowth: 1000000,
          },
        ],
      },
      {
        totalValue: 0,
        totalValueInFirstYearDollars: 0,
        investments: [
          {
            percentage: 0,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 0,
            valueInFirstYearDollars: 0,
            valueAfterWithdrawal: 0,
            valueWithGrowth: 0,
          },
        ],
      },
      {
        investments: [
          {
            dividendsAmount: 0,
            feesAmount: 0,
            growthAmount: 0,
            percentage: 0,
            startingPercentage: 0,
            type: 'equity',
            value: 0,
            valueInFirstYearDollars: 0,
            valueAfterWithdrawal: 0,
            valueWithGrowth: 0,
          },
        ],
        totalValue: 0,
        totalValueInFirstYearDollars: 0,
      },
    ];

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1931,
      duration: 2,
      isComplete: true,
      ranOutOfMoney: true,
      yearRanOutOfMoney: 1930,
      numberOfYearsWithMoneyInPortfolio: 0,
      lastYearEndPortfolioValue: 0,
      totalInflationOverPeriod: 1,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: true,
          marketData: marketData.byYear[1930],
          startCpi: 30,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 1000000,
          baseWithdrawalAmount: 1000000,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 1000000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
        {
          year: 1931,
          month: 1,
          yearNumber: 1,
          isOutOfMoneyAtEnd: true,
          marketData: marketData.byYear[1931],
          startCpi: 30,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 0,
          baseWithdrawalAmount: 0,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 0,
          startPortfolio: expectedPortfolios[1],
          endPortfolio: expectedPortfolios[2],
        },
      ],
    });
  });

  it('can be inflation adjusted', () => {
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
          startCpi: 100,
          endCpi: 103,
          inflationOverPeriod: 1,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 103,
          endCpi: 106.09,
          inflationOverPeriod: 1,
          cape: 100,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1932: {
          year: 1932,
          month: 1,
          startCpi: 106.09,
          endCpi: 109.2727,
          inflationOverPeriod: 1,
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
      additionalIncome: [
        {
          name: '',
          value: 10000,
          inflationAdjusted: true,
          duration: 2,
          startYear: 0,
        },
      ],
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
            valueInFirstYearDollars: 1000000,
            valueAfterWithdrawal: 1000000,
            valueWithGrowth: 1000000,
          },
        ],
      },
      {
        totalValue: 970000,
        // = 970,000 / 1.03
        // = 941747.57
        totalValueInFirstYearDollars: 941747.57,
        investments: [
          {
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 970000,
            valueInFirstYearDollars: 941747.57,
            valueAfterWithdrawal: 970000,
            valueWithGrowth: 970000,
          },
        ],
      },
      {
        totalValue: 940300,
        totalValueInFirstYearDollars: 886322.93,
        investments: [
          {
            dividendsAmount: 0,
            feesAmount: 0,
            growthAmount: 0,
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            // 970,000 = starting value
            // - $40k not-inflation adjusted withdrawal = $930,000
            // + $10.3k inflation-adjusted income = 940,300
            value: 940300,
            valueAfterWithdrawal: 940300,
            // 940,000 / 1.0609
            // = 886,322.93
            valueInFirstYearDollars: 886322.93,
            valueWithGrowth: 940300,
          },
        ],
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
      lastYearEndPortfolioValue: 940300,
      // 1.03 each year, 2 years
      // = 1.03 ^ 2
      // = 1.0609
      totalInflationOverPeriod: 1.0609,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1.03,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 10000,
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
          endCumulativeInflationSinceFirstYear: 1.0609,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          // 10,000 * 1.03 = 10300
          additionalIncomeAmount: 10300,
          // Withdrawals occur at the start of the year, so we use 1.03 as inflation here
          // = 40,000 / 1.03
          // = 38834.95
          totalWithdrawalAmountInFirstYearDollars: 38834.95,
          startPortfolio: expectedPortfolios[1],
          endPortfolio: expectedPortfolios[2],
        },
      ],
    });
  });
});
