import runSimulations from '../../index';

describe('runSimulation', () => {
  it('it returns the expected data', done => {
    const result = runSimulations({
      yearlyWithdrawal() {
        return 40000;
      },
      lengthOfRetirement: {
        numberOfYears: 3,
      },
      portfolio: {
        bondsValue: 0,
        stockInvestmentFees: 0.04,
        stockInvestmentValue: 1000000,
      },
      historicalDataRange: {
        firstYear: 1930,
        lastYear: 1932,
        useAllHistoricalData: true,
      },
      additionalWithdrawals: [],
      additionalIncome: [],
      calculationId: 1,
      analytics: {},
      marketData: {
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
          1932: {
            year: 1932,
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
          1933: {
            year: 1933,
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
          1934: {
            year: 1934,
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
        lastSupportedYear: 1934,
        avgMarketDataCape: 100,
      },
    });

    expect(result instanceof Promise).toBe(true);

    result.then(res => {
      expect(res.calculationId).toEqual(1);
      expect(res.simulations).toHaveLength(2);
      expect(res.completeSimulations).toHaveLength(2);
      expect(res.incompleteSimulations).toHaveLength(0);
      expect(res.analysis).toEqual({});

      done();
    });
  });
});
