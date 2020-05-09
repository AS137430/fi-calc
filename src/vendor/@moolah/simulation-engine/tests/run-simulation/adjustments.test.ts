import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('adjustments', () => {
  it('withdrawals and income cancel one another out', () => {
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
      additionalWithdrawals: [
        {
          name: '',
          value: 10000,
          inflationAdjusted: false,
          duration: 1,
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
            rebalanceDelta: 0,
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
            rebalanceDelta: 0,
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
          totalWithdrawalAmount: 50000,
          baseWithdrawalAmount: 40000,
          additionalWithdrawalAmount: 10000,
          additionalIncomeAmount: 10000,
          totalWithdrawalAmountInFirstYearDollars: 50000,
          startPortfolio: expectedPortfolios[0],
          endPortfolio: expectedPortfolios[1],
        },
      ],
    });
  });
});
