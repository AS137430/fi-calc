import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('runSimulation, mixed portfolio, one year', () => {
  describe('money remaining', () => {
    it('no equities growth/fees/inflation; portfolio remains balanced even with rebalancePortfolioAnnually=false', () => {
      const portfolioDefinition: PortfolioDefinition = {
        totalValue: 1000000,
        investments: [
          {
            percentage: 0.75,
            type: 'equity',
            fees: 0,
            value: 750000,
          },
          {
            percentage: 0.25,
            type: 'bonds',
            fees: 0,
            value: 250000,
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
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              dividendsAmount: 0,
              type: 'equity',
              growthAmount: 0,
              feesAmount: 0,
              value: 750000,
              valueInFirstYearDollars: 750000,
              valueAfterWithdrawal: 750000,
              valueWithGrowth: 750000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 250000,
              valueInFirstYearDollars: 250000,
              valueAfterWithdrawal: 250000,
              valueWithGrowth: 250000,
            },
          ],
        },
        {
          totalValue: 960000,
          totalValueInFirstYearDollars: 960000,
          investments: [
            {
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              type: 'equity',
              growthAmount: 0,
              dividendsAmount: 0,
              feesAmount: 0,
              value: 720000,
              valueInFirstYearDollars: 720000,
              valueAfterWithdrawal: 720000,
              valueWithGrowth: 720000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 240000,
              valueInFirstYearDollars: 240000,
              valueAfterWithdrawal: 240000,
              valueWithGrowth: 240000,
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

    it('no equities growth/fees/inflation; portfolio remains balanced with rebalancePortfolioAnnually=true', () => {
      const portfolioDefinition: PortfolioDefinition = {
        totalValue: 1000000,
        investments: [
          {
            percentage: 0.75,
            type: 'equity',
            fees: 0,
            value: 750000,
          },
          {
            percentage: 0.25,
            type: 'bonds',
            fees: 0,
            value: 250000,
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
        rebalancePortfolioAnnually: true,
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
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              dividendsAmount: 0,
              type: 'equity',
              growthAmount: 0,
              feesAmount: 0,
              value: 750000,
              valueInFirstYearDollars: 750000,
              valueAfterWithdrawal: 750000,
              valueWithGrowth: 750000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 250000,
              valueInFirstYearDollars: 250000,
              valueAfterWithdrawal: 250000,
              valueWithGrowth: 250000,
            },
          ],
        },
        {
          totalValue: 960000,
          totalValueInFirstYearDollars: 960000,
          investments: [
            {
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              type: 'equity',
              growthAmount: 0,
              dividendsAmount: 0,
              feesAmount: 0,
              value: 720000,
              valueInFirstYearDollars: 720000,
              valueAfterWithdrawal: 720000,
              valueWithGrowth: 720000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 240000,
              valueInFirstYearDollars: 240000,
              valueAfterWithdrawal: 240000,
              valueWithGrowth: 240000,
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

    it('portfolio remains balanced with rebalancePortfolioAnnually=true', () => {
      const portfolioDefinition: PortfolioDefinition = {
        totalValue: 1000000,
        investments: [
          {
            percentage: 0.75,
            type: 'equity',
            fees: 0.0004,
            value: 750000,
          },
          {
            percentage: 0.25,
            type: 'bonds',
            fees: 0,
            value: 250000,
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
            inflationOverPeriod: 1,
            dividendYields: 0.01,
            bondsGrowth: 0.01,
            stockMarketGrowth: 0.06,
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
        rebalancePortfolioAnnually: true,
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
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              dividendsAmount: 0,
              type: 'equity',
              growthAmount: 0,
              feesAmount: 0,
              value: 750000,
              valueInFirstYearDollars: 750000,
              valueAfterWithdrawal: 750000,
              valueWithGrowth: 750000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 250000,
              valueInFirstYearDollars: 250000,
              valueAfterWithdrawal: 250000,
              valueWithGrowth: 250000,
            },
          ],
        },
        {
          // after adjustments, but before rebalancing, we have:
          // equities: 770094.72
          // bonds: 242,400
          // add those together for: 1012494.72
          totalValue: 1012494.72,
          // 1012494.72 / 1.03 = 983004.58
          totalValueInFirstYearDollars: 983004.58,
          investments: [
            {
              rebalanceDelta: -10723.68,
              percentage: 0.75,
              startingPercentage: 0.75,
              type: 'equity',
              // The total withdrawal is 40k. 75% of that comes
              // from stocks, or $30k.
              // We start with 750k, so we end up with 750 - 30 = 720k
              valueAfterWithdrawal: 720000,
              // This all occurs in January, at the start of the year.
              // Over the course of the year, we see growth/fees/dividends
              // on the 720k that remain.
              // 0.06 growth = 720k * 0.06 = 43,200
              growthAmount: 43200,
              valueWithGrowth: 763200,

              // 0.01 dividends = 720k * 0.1 = 7,200
              dividendsAmount: 7200,

              // Fees apply to (value + growth). Notably, they do not apply to dividends.
              // 0.0004 fees = (720k + 43.2k) * 0.0004 = 305.28
              feesAmount: 305.28,

              // 720 + growth + dividends - fees
              // 720k + 43.2k + 7.2k + 305.28 = 770094.72
              // However, that is 76.1% of the total portfolio, so we must rebalance it.
              // 75% of 1012494.72 = 759,371.04
              value: 759371.04,
              // 759371.04 / 1.03 = 747664.78
              valueInFirstYearDollars: 737253.44,
            },
            {
              rebalanceDelta: 10723.68,
              percentage: 0.25,
              startingPercentage: 0.25,
              type: 'bonds',
              // Start value is $250k. 25% of 40k withdrawal = $10k
              // 250,000 - 10,000 = 240,000
              valueAfterWithdrawal: 240000,
              // growth = 240,000 * 0.01 = 2400
              growthAmount: 2400,
              // + growth = 240,000 + 2,400 = 242,400
              valueWithGrowth: 242400,
              // No dividends
              dividendsAmount: 0,
              // No fees
              feesAmount: 0,
              // Add it all up: 242,400
              // However, this needs to be rebalanced to be 25%, so we
              // take 25% of 1012494.72 =
              value: 253123.68,
              // 253,123.68 / 1.03 =  245,751.15
              valueInFirstYearDollars: 245751.15,
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
        lastYearEndPortfolioValue: 1012494.72,
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

    it('portfolio does not remain balanced with rebalancePortfolioAnnually=false', () => {
      const portfolioDefinition: PortfolioDefinition = {
        totalValue: 1000000,
        investments: [
          {
            percentage: 0.75,
            type: 'equity',
            fees: 0.0004,
            value: 750000,
          },
          {
            percentage: 0.25,
            type: 'bonds',
            fees: 0,
            value: 250000,
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
            inflationOverPeriod: 1,
            dividendYields: 0.01,
            bondsGrowth: 0.01,
            stockMarketGrowth: 0.06,
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
              rebalanceDelta: 0,
              percentage: 0.75,
              startingPercentage: 0.75,
              dividendsAmount: 0,
              type: 'equity',
              growthAmount: 0,
              feesAmount: 0,
              value: 750000,
              valueInFirstYearDollars: 750000,
              valueAfterWithdrawal: 750000,
              valueWithGrowth: 750000,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.25,
              startingPercentage: 0.25,
              dividendsAmount: 0,
              type: 'bonds',
              growthAmount: 0,
              feesAmount: 0,
              value: 250000,
              valueInFirstYearDollars: 250000,
              valueAfterWithdrawal: 250000,
              valueWithGrowth: 250000,
            },
          ],
        },
        {
          totalValue: 1012494.72,
          totalValueInFirstYearDollars: 983004.58,
          investments: [
            {
              rebalanceDelta: 0,
              percentage: 0.7605913441207871,
              startingPercentage: 0.75,
              type: 'equity',
              // The total withdrawal is 40k. 75% of that comes
              // from stocks, or $30k.
              // We start with 750k, so we end up with 750 - 30 = 720k
              valueAfterWithdrawal: 720000,
              // This all occurs in January, at the start of the year.
              // Over the course of the year, we see growth/fees/dividends
              // on the 720k that remain.
              // 0.06 growth = 720k * 0.06 = 43,200
              growthAmount: 43200,
              valueWithGrowth: 763200,

              // 0.01 dividends = 720k * 0.1 = 7,200
              dividendsAmount: 7200,

              // Fees apply to (value + growth). Notably, they do not apply to dividends.
              // 0.0004 fees = (720k + 43.2k) * 0.0004 = 305.28
              feesAmount: 305.28,

              // 720 + growth + dividends - fees
              // 720k + 43.2k + 7.2k + 305.28 = 770094.72
              value: 770094.72,
              // 770094.72 / 1.03 = 747664.78
              valueInFirstYearDollars: 747664.78,
            },
            {
              rebalanceDelta: 0,
              percentage: 0.2394086558792129,
              startingPercentage: 0.25,
              type: 'bonds',
              // Start value is $250k. 25% of 40k withdrawal = $10k
              // 250,000 - 10,000 = 240,000
              valueAfterWithdrawal: 240000,
              // growth = 240,000 * 0.01 = 2400
              growthAmount: 2400,
              // + growth = 240,000 + 2,400 = 242,400
              valueWithGrowth: 242400,
              // No dividends
              dividendsAmount: 0,
              // No fees
              feesAmount: 0,
              // Add it all up: 242,400
              value: 242400,
              // 242,400 / 1.03 =  235,339.81
              valueInFirstYearDollars: 235339.81,
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
        lastYearEndPortfolioValue: 1012494.72,
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
