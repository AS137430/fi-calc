import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('runSimulation, additional withdrawals', () => {
  it('is ignored with duration 0', () => {
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
          endCpi: 100,
          cape: 100,
          inflationOverPeriod: 1,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 100,
          endCpi: 100,
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
      duration: 1,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalIncome: [
        {
          name: '',
          value: 10000,
          inflationAdjusted: true,
          duration: 0,
          startYear: 0,
        },
      ],
      additionalWithdrawals: [],
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
            valueInFirstYearDollars: 960000,
            valueAfterWithdrawal: 960000,
            valueWithGrowth: 960000,
          },
        ],
      },
    ];

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1930,
      duration: 1,
      isComplete: true,
      ranOutOfMoney: false,
      yearRanOutOfMoney: null,
      numberOfYearsWithMoneyInPortfolio: 1,
      lastYearEndPortfolioValue: 960000,
      totalInflationOverPeriod: 1,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
      ],
    });
  });

  it('is ignored when start/end year do not overlap', () => {
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
          endCpi: 100,
          cape: 100,
          inflationOverPeriod: 1,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 100,
          endCpi: 100,
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
      duration: 1,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalIncome: [
        {
          name: '',
          value: 10000,
          inflationAdjusted: true,
          duration: 10,
          startYear: 1,
        },
      ],
      additionalWithdrawals: [],
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
            valueInFirstYearDollars: 960000,
            valueAfterWithdrawal: 960000,
            valueWithGrowth: 960000,
          },
        ],
      },
    ];

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1930,
      duration: 1,
      isComplete: true,
      ranOutOfMoney: false,
      yearRanOutOfMoney: null,
      numberOfYearsWithMoneyInPortfolio: 1,
      lastYearEndPortfolioValue: 960000,
      totalInflationOverPeriod: 1,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalIncomeAmount: 0,
          additionalWithdrawalAmount: 0,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
      ],
    });
  });

  it('no equities growth/fees/inflation, income matches (and is adjusted for inflation)', () => {
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
          endCpi: 100,
          cape: 100,
          inflationOverPeriod: 1,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 100,
          endCpi: 100,
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
      duration: 1,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalIncome: [
        {
          name: '',
          value: 10000,
          // NOTE: withdrawals occur at the beginning of this year, so even though this is inflation-adjusted
          // the inflation at the time of the withdrawal is always 1.
          // Look at two-year tests to see when inflation actually factors in
          inflationAdjusted: true,
          duration: 1,
          startYear: 0,
        },
      ],
      additionalWithdrawals: [],
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
        totalValueInFirstYearDollars: 970000,
        investments: [
          {
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 970000,
            valueInFirstYearDollars: 970000,
            valueAfterWithdrawal: 970000,
            valueWithGrowth: 970000,
          },
        ],
      },
    ];

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1930,
      duration: 1,
      isComplete: true,
      ranOutOfMoney: false,
      yearRanOutOfMoney: null,
      numberOfYearsWithMoneyInPortfolio: 1,
      lastYearEndPortfolioValue: 970000,
      totalInflationOverPeriod: 1,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 10000,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
      ],
    });
  });

  // same as above given that inflation for income over 1 yr is not factored in
  it('no equities growth/fees/inflation, income matches (and is NOT adjusted for inflation)', () => {
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
          endCpi: 100,
          cape: 100,
          inflationOverPeriod: 1,
          dividendYields: 0,
          bondsGrowth: 0,
          stockMarketGrowth: 0,
          none: 0,
        },
        1931: {
          year: 1931,
          month: 1,
          startCpi: 100,
          endCpi: 100,
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
      duration: 1,
      rebalancePortfolioAnnually: false,
      portfolioDefinition,
      additionalIncome: [
        {
          name: '',
          value: 10000,
          inflationAdjusted: false,
          duration: 1,
          startYear: 0,
        },
      ],
      additionalWithdrawals: [],
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
        totalValueInFirstYearDollars: 970000,
        investments: [
          {
            percentage: 1,
            startingPercentage: 1,
            type: 'equity',
            growthAmount: 0,
            dividendsAmount: 0,
            feesAmount: 0,
            value: 970000,
            valueInFirstYearDollars: 970000,
            valueAfterWithdrawal: 970000,
            valueWithGrowth: 970000,
          },
        ],
      },
    ];

    expect(sim).toEqual({
      simulationNumber: 1,
      firstYearStartPortfolioValue: 1000000,
      startYear: 1930,
      endYear: 1930,
      duration: 1,
      isComplete: true,
      ranOutOfMoney: false,
      yearRanOutOfMoney: null,
      numberOfYearsWithMoneyInPortfolio: 1,
      lastYearEndPortfolioValue: 970000,
      totalInflationOverPeriod: 1,
      resultsByYear: [
        {
          year: 1930,
          month: 1,
          yearNumber: 0,
          isOutOfMoneyAtEnd: false,
          marketData: marketData.byYear[1930],
          startCpi: 100,
          cumulativeInflationSinceFirstYear: 1,
          endCumulativeInflationSinceFirstYear: 1,
          totalWithdrawalAmount: 40000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 0,
          additionalIncomeAmount: 10000,
          totalWithdrawalAmountInFirstYearDollars: 40000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
      ],
    });
  });
});
