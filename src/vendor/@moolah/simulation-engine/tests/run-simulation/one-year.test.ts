import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('runSimulation, one year', () => {
  describe('no money remaining', () => {
    it('no equities growth/fees/inflation', () => {
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
          return 1500000;
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
      ];

      expect(sim).toEqual({
        simulationNumber: 1,
        firstYearStartPortfolioValue: 1000000,
        startYear: 1930,
        endYear: 1930,
        duration: 1,
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
            startCpi: 100,
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
        ],
      });
    });
  });

  describe('money remaining', () => {
    it('no equities growth/fees/inflation', () => {
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

    it('no inflation, 5% equities growth, 1% equities fees', () => {
      const portfolioDefinition: PortfolioDefinition = {
        totalValue: 1000000,
        investments: [
          {
            percentage: 1,
            type: 'equity',
            fees: 0.01,
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
            stockMarketGrowth: 0.05,
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
            stockMarketGrowth: 0.05,
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
          // First, we withdraw our money from the start portfolio (this occurs at the start of the year)
          // 100,000 - 40,000 = 960,000
          //
          // Then we calculate the growth of the asset over the course of the year
          // 960,000 * 1.05 = 1,008,000
          //
          // And lastly, the fees of the asset for the year
          // 1,008,000 * 0.99 = 99,720
          totalValue: 997920,
          totalValueInFirstYearDollars: 997920,
          investments: [
            {
              percentage: 1,
              startingPercentage: 1,
              type: 'equity',
              growthAmount: 48000,
              dividendsAmount: 0,
              feesAmount: 10080,
              value: 997920,
              valueInFirstYearDollars: 997920,
              valueAfterWithdrawal: 960000,
              valueWithGrowth: 1008000,
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
        lastYearEndPortfolioValue: 997920,
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

    it('no equities growth/fees, 3% inflation', () => {
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
            additionalIncomeAmount: 0,
            totalWithdrawalAmountInFirstYearDollars: 40000,
            startPortfolio: expectedPortfolios[0],
            endPortfolio: expectedPortfolios[1],
          },
        ],
      });
    });
  });
});
