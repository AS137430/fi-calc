import guytonKlinger from './guyton-klinger';

describe('guytonKlinger', () => {
  describe('first year', () => {
    it('returns the initial result', () => {
      const withdrawal = guytonKlinger({
        yearsRemaining: 30,
        inflation: 1,
        isFirstYear: true,
        cpi: 100,
        previousYearCpi: 100,
        portfolioTotalValue: 1000000,
        gkInitialWithdrawal: 40000,
        firstYearStartPortolioTotalValue: 1000000,

        stockMarketGrowth: 0.03,
        previousYearBaseWithdrawalAmount: 0,
      });

      expect(withdrawal).toEqual({
        value: 40000,
        meta: {
          modifiedWithdrawalRuleApplied: false,
          capitalPreservationRuleApplied: false,
          prosperityRuleApplied: false,
        },
      });
    });

    it('returns the initial result, even for large % withdrawals', () => {
      const withdrawal = guytonKlinger({
        yearsRemaining: 30,
        inflation: 1,
        isFirstYear: true,
        cpi: 100,
        previousYearCpi: 100,
        portfolioTotalValue: 1000000,
        gkInitialWithdrawal: 900000,
        firstYearStartPortolioTotalValue: 1000000,

        stockMarketGrowth: 0.03,
        previousYearBaseWithdrawalAmount: 0,
      });

      expect(withdrawal).toEqual({
        value: 900000,
        meta: {
          modifiedWithdrawalRuleApplied: false,
          capitalPreservationRuleApplied: false,
          prosperityRuleApplied: false,
        },
      });
    });
  });

  describe('> 1 years', () => {
    // Three conditions:
    describe('Modified Withdrawal Rule', () => {
      it('applies when all of the conditions are met', () => {
        const withdrawal = guytonKlinger({
          yearsRemaining: 25,
          inflation: 1.02,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,

          stockMarketGrowth: -0.05,
          previousYearBaseWithdrawalAmount: 45500,
        });

        expect(withdrawal).toEqual({
          value: 45500,
          meta: {
            modifiedWithdrawalRuleApplied: true,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: false,
          },
        });
      });
    });
  });
});
