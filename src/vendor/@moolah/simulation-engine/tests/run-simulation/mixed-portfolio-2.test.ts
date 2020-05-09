import runSimulation from '../../run-simulation';
import { PortfolioDefinition } from '../../types';

describe('runSimulation, mixed portfolio, one year', () => {
  describe('money remaining', () => {
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
            inflationOverPeriod: 1.03,
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
            inflationOverPeriod: 1.03,
            cape: 100,
            dividendYields: 0.009,
            bondsGrowth: 0.008,
            stockMarketGrowth: 0.05,
            none: 0,
          },
          1932: {
            year: 1932,
            month: 1,
            startCpi: 106.09,
            endCpi: 109.2727,
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
        duration: 2,
        rebalancePortfolioAnnually: true,
        portfolioDefinition,
        additionalWithdrawals: [],
        additionalIncome: [],
        marketData,
      });

      const expectedPortfolios = [
        // Start of Year 1
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
        // End of Year 1 / Start of Year 2
        {
          totalValue: 1012494.72,
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
        // End of Year 2
        {
          // Equities + bonds
          // = 772,097.59 + 245,068.67
          // = 1,017,166.26
          totalValue: 1017166.26,
          totalValueInFirstYearDollars: 958776.76,
          investments: [
            {
              // 772097.59-762874.7 = -9222.89
              rebalanceDelta: -9222.89,
              percentage: 0.75,
              startingPercentage: 0.7500000000000001,
              type: 'equity',
              // The total withdrawal is 40k. 75% of that comes
              // from stocks, or $30k.
              // We start with 759371.04, so we end up with 759371.04 - 30000 = 729,371.04
              valueAfterWithdrawal: 729371.04,
              // This all occurs in January, at the start of the year.
              // Over the course of the year, we see growth/fees/dividends
              // on the 720k that remain.
              // 0.05 growth = 729,371.04 * 0.05 = 36,468.552
              growthAmount: 36468.55,
              // Add the two together: 765,839.592
              valueWithGrowth: 765839.59,

              // 0.009 dividends = 729,371.04 * 0.009 = 6,564.339
              dividendsAmount: 6564.34,

              // Fees apply to (value + growth). Notably, they do not apply to dividends.
              // 0.0004 fees = (759371.04 + 36468.55) * 0.0004 = 306.335
              feesAmount: 306.34,

              // valueAfterWithdrawal + growth + dividends - fees
              // 720k + 43.2k + 7.2k + 305.28 = 772,097.59
              // However, that is 76.1% of the total portfolio, so we must rebalance it.
              // 75% of 1012494.72 = 762,874.695
              value: 762874.7,
              // 762874.7 / 1.03 = 719082.57
              valueInFirstYearDollars: 719082.57,
            },
            {
              rebalanceDelta: 9222.9,
              percentage: 0.25,
              startingPercentage: 0.25,
              type: 'bonds',
              // Start value is $253123.68. 25% of 40k withdrawal = 10k
              // 253123.68 - 10,000 = 243,123.68
              valueAfterWithdrawal: 243123.68,
              // growth = 243123.68 * 0.01 = 1,944.99
              growthAmount: 1944.99,
              // + growth = 243123.68 + 1,944.98 = 245,068.67
              valueWithGrowth: 245068.67,
              // No dividends
              dividendsAmount: 0,
              // No fees
              feesAmount: 0,
              // Add it all up: 245,068.67
              // However, this needs to be rebalanced to be 25%, so we
              // take 25% of 1017166.26 = 254,291.57
              value: 254291.57,
              // 254291.57 / 1.03 =  239694.19
              valueInFirstYearDollars: 239694.19,
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
        // End of year 1: 1012494.72
        // End of year 2: 1017166.26
        lastYearEndPortfolioValue: 1017166.26,
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
            additionalIncomeAmount: 0,
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
            additionalIncomeAmount: 0,
            // 40000 / 1.03 = 38,834.95
            totalWithdrawalAmountInFirstYearDollars: 38834.95,
            startPortfolio: expectedPortfolios[1],
            endPortfolio: expectedPortfolios[2],
          },
        ],
      });
    });
  });
});
