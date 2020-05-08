import runSimulation from './run-simulation';
import { PortfolioDefinition } from './types';

describe('runSimulation', () => {
  describe('one year', () => {
    it('no growth/fees, 3% inflation', () => {
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
            cape: 100,
            inflationOverPeriod: 1.03,
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
            inflationOverPeriod: 1.03,
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
              valueInFirstYearDollars: 1000000,
              valueAfterWithdrawal: 1000000,
              valueWithGrowth: 1000000,
            },
          ],
        },
        {
          totalValue: 960000,
          // $960,000 / 1.03 = $932,038.83
          totalValueInFirstYearDollars: 932038.83,
          investments: [
            {
              percentage: 1,
              startingPercentage: 1,
              type: 'equity',
              growthAmount: 0,
              dividendsAmount: 0,
              feesAmount: 0,
              value: 960000,
              valueInFirstYearDollars: 932038.83,
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
            endCumulativeInflationSinceFirstYear: 1.03,
            totalWithdrawalAmount: 40000,
            baseWithdrawalAmount: 40000,
            additionalWithdrawalAmount: 0,
            totalWithdrawalAmountInFirstYearDollars: 40000,
            startPortfolio: expectedPortfolios[0],
            endPortfolio: expectedPortfolios[1],
          },
        ],
      });
    });
  });

  describe('two years', () => {
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
          1933: {
            year: 1933,
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
              valueInFirstYearDollars: 920000,
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
            endCumulativeInflationSinceFirstYear: 1,
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
            endCumulativeInflationSinceFirstYear: 1,
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
  });
});
