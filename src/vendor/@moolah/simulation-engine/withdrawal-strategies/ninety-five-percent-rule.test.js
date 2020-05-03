import ninetyFivePercentRule from './ninety-five-percent-rule';

describe('ninetyFive', () => {
  describe('first year', () => {
    it('uses the initial withdrawal rate', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 10000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,
        })
      ).toBe(4000);
    });

    it('respects min withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 10000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,

          minWithdrawal: 2500,
          inflation: 2,
        })
      ).toBe(5000);
    });

    it('respects max withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 10000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,

          maxWithdrawal: 1000,
          inflation: 2,
        })
      ).toBe(2000);
    });
  });
});
