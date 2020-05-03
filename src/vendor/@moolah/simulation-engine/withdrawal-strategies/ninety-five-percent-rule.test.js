import ninetyFivePercentRule from './ninety-five-percent-rule';

describe('ninetyFive', () => {
  describe('first year', () => {
    it('uses the initial withdrawal rate', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 100000,
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
          portfolioTotalValue: 100000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,

          minWithdrawal: 5000,
        })
      ).toBe(5000);
    });

    it('respects max withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 100000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,

          maxWithdrawal: 2000,
        })
      ).toBe(2000);
    });
  });

  describe('not first year', () => {
    it('uses withdrawal % of current portfolio when it is more than 95% of last year', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 200000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 4000,
        })
      ).toBe(8000);
    });

    it('uses 95% of last year when its more than % of current portfolio', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 50000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 4000,
        })
      ).toBe(3800);
    });

    it('respects min withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 200000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 4000,

          minWithdrawal: 20000,
        })
      ).toBe(20000);
    });

    it('respects max withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 200000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 4000,

          maxWithdrawal: 2000,
        })
      ).toBe(2000);
    });
  });
});
