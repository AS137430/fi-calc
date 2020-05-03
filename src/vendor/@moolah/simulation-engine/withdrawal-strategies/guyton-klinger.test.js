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
    // (1) portfolio returns are NEGATIVE for the year
    // (2) current withdrawal is GREATER than first year
    // (3) applying inflation INCREASES withdrawal rate
    describe('Modified Withdrawal Rule', () => {
      it('applies when all of the conditions are met', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 46865
          previousYearBaseWithdrawalAmount: 45500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          // this ensures condition (1) is TRUE
          stockMarketGrowth: -0.05,

          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
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

      it('does not apply when condition (1) isnt met', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 46865
          previousYearBaseWithdrawalAmount: 45500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          // this ensures condition (1) is FALSE
          stockMarketGrowth: 0.05,

          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          // year-over-year inflation is 1.03 (calculated from the cpi / prevYearCpi)
          // so we get this value from 45500 * 1.03 = 46865
          value: 46865,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: false,
          },
        });
      });

      it('does not apply when condition (2) isnt met', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 39,655
          previousYearBaseWithdrawalAmount: 38500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          // this ensures condition (1) is TRUE
          stockMarketGrowth: -0.05,

          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          value: 39655,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: false,
          },
        });
      });

      it('does not apply when condition (3) isnt met', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 45,045
          previousYearBaseWithdrawalAmount: 45500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          // this ensures condition (1) is TRUE
          stockMarketGrowth: -0.05,

          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 99,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          value: 45045,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: false,
          },
        });
      });
    });
  });
});
