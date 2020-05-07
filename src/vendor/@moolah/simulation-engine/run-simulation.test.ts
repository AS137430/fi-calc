import runSimulation from './run-simulation';
import { InvestmentType, MarketDataGrowthKeys } from './types';

function getBasicPortfolioDefinition() {
  return {
    totalValue: 1000000,
    investments: [
      {
        percentage: 1,
        type: InvestmentType.equity,
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
        [MarketDataGrowthKeys.bondsGrowth]: 1,
        [MarketDataGrowthKeys.stockMarketGrowth]: 1.04,
        [MarketDataGrowthKeys.none]: 1,
      },
      1931: {
        year: 1931,
        month: 1,
        cpi: 35,
        cape: 105,
        dividendYields: 0,
        [MarketDataGrowthKeys.bondsGrowth]: 1,
        [MarketDataGrowthKeys.stockMarketGrowth]: 1.04,
        [MarketDataGrowthKeys.none]: 1,
      },
      1932: {
        year: 1932,
        month: 1,
        cpi: 40,
        cape: 95,
        dividendYields: 0,
        [MarketDataGrowthKeys.bondsGrowth]: 1,
        [MarketDataGrowthKeys.stockMarketGrowth]: 1.04,
        [MarketDataGrowthKeys.none]: 1,
      },
      1933: {
        year: 1933,
        month: 1,
        cpi: 45,
        cape: 100,
        dividendYields: 0,
        [MarketDataGrowthKeys.bondsGrowth]: 1,
        [MarketDataGrowthKeys.stockMarketGrowth]: 1.04,
        [MarketDataGrowthKeys.none]: 1,
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
      lastYearEndPortfolioValue: 3913536,
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
                dividends: 0,
                type: InvestmentType.equity,
                growth: 0,
                fees: 0,
                value: 1000000,
                valueAfterWithdrawal: 1000000,
                valueBeforeChange: 1000000,
                valueWithGrowth: 1000000,
              },
            ],
          },
          endPortfolio: {
            totalValue: 1958400,
            totalValueInFirstYearDollars: 1958400,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                type: InvestmentType.equity,
                growth: 998400,
                dividends: 0,
                fees: 0,
                value: 1958400,
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
            totalValue: 1958400,
            totalValueInFirstYearDollars: 1958400,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                type: InvestmentType.equity,
                dividends: 0,
                fees: 0,
                growth: 998400,
                value: 1958400,
                valueAfterWithdrawal: 960000,
                valueBeforeChange: 1000000,
                valueWithGrowth: 1958400,
              },
            ],
          },
          endPortfolio: {
            totalValue: 3913536,
            totalValueInFirstYearDollars: 3354459.43,
            investments: [
              {
                percentage: 1,
                startingPercentage: 1,
                type: InvestmentType.equity,
                dividends: 0,
                fees: 0,
                value: 3913536,
                growth: 1995136,
                valueAfterWithdrawal: 1918400,
                valueBeforeChange: 1000000,
                valueWithGrowth: 3913536,
              },
            ],
          },
        },
      ],
    });
  });
});
