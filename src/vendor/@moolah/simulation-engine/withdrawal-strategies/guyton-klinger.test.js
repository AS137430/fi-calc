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
    // The Modified Withdrawal Rule applies when three conditions are met:
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

      it('can be disabled', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 46865
          previousYearBaseWithdrawalAmount: 45500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          // this ensures condition (1) is TRUE
          stockMarketGrowth: -0.05,

          gkModifiedWithdrawalRule: false,
          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          value: 46865,
          meta: {
            modifiedWithdrawalRuleApplied: false,
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

    describe('Properity Rule', () => {
      it('applies when spending goes too low', () => {
        const withdrawal = guytonKlinger({
          // adjusting this for inflation = 34,505
          previousYearBaseWithdrawalAmount: 33500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          stockMarketGrowth: 0.03,

          yearsRemaining: 5,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          // inflationAdjustedPrevWithdrawal * 1.1
          //  = 34,505 * 1.1
          //  = 37955.5
          value: 37955.5,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: true,
          },
        });
      });
    });

    describe('Capital Preservation Rule', () => {
      it('applies when spending goes too high (> 15 years remain)', () => {
        const withdrawal = guytonKlinger({
          // This is so high because it computes the withdrawal % from the
          // current-year portfolio value, which we have set at 1.2m
          // adjusting this for inflation = 62,315
          previousYearBaseWithdrawalAmount: 60500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          stockMarketGrowth: 0.03,

          yearsRemaining: 25,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          // inflationAdjustedPrevWithdrawal * 0.9
          //  = 62,315 * 0.9
          //  = 56,083.5
          value: 56083.5,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: true,
            prosperityRuleApplied: false,
          },
        });
      });

      it('is ignored when < 15 years remain', () => {
        const withdrawal = guytonKlinger({
          // This is so high because it computes the withdrawal % from the
          // current-year portfolio value, which we have set at 1.2m
          // adjusting this for inflation = 62,315
          previousYearBaseWithdrawalAmount: 60500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          stockMarketGrowth: 0.03,

          yearsRemaining: 14,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          // = inflationAdjustedPrevWithdrawal
          // = 62,315
          value: 62315,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: false,
            prosperityRuleApplied: false,
          },
        });
      });

      it('is can be enabled even when < 15 years remain', () => {
        const withdrawal = guytonKlinger({
          // This is so high because it computes the withdrawal % from the
          // current-year portfolio value, which we have set at 1.2m
          // adjusting this for inflation = 62,315
          previousYearBaseWithdrawalAmount: 60500,
          // first year withdrawal with this inflation = 40,800
          inflation: 1.02,
          stockMarketGrowth: 0.03,

          yearsRemaining: 14,
          isFirstYear: false,
          cpi: 103,
          previousYearCpi: 100,
          gkIgnoreLastFifteenYears: false,
          portfolioTotalValue: 1200000,
          gkInitialWithdrawal: 40000,
          firstYearStartPortolioTotalValue: 1000000,
        });

        expect(withdrawal).toEqual({
          // inflationAdjustedPrevWithdrawal * 0.9
          //  = 62,315 * 0.9
          //  = 56,083.5
          value: 56083.5,
          meta: {
            modifiedWithdrawalRuleApplied: false,
            capitalPreservationRuleApplied: true,
            prosperityRuleApplied: false,
          },
        });
      });
    });
  });
});
