import ninetyFivePercentRule from './ninety-five-percent-rule';

describe('ninetyFive', () => {
  // The following tests are from:
  //
  // The Work Less, Live More Workbook.
  // 2007
  // Bob Clyatt
  //
  // Chapter 4. Financing Your Retirement
  // Page 128
  // "Using the 95% Rule" chart
  describe('The Work Less, Live More Workbook test cases', () => {
    it('Year 1', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: true,

          firstYearStartPortolioTotalValue: 1000000,
          portfolioTotalValue: 1000000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 0,
        })
      ).toBe(40000);
    });

    it('Year 2', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 1000000,
          portfolioTotalValue: 1046400,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 40000,
        })
      ).toBe(41856);
    });

    it('Year 3', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 1000000,
          portfolioTotalValue: 1024635,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 41856,
        })
        // $40,985 in the book (he rounds the decimal away)
      ).toBe(40985.4);
    });

    it('Year 4', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 1000000,
          portfolioTotalValue: 914794,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 40985,
        })
        // $38,936 in the book (he rounds)
      ).toBe(38935.75);
    });

    it('Year 5', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 1000000,
          portfolioTotalValue: 928409,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 38936,
        })
        // $37,136 in the book (he rounds)
      ).toBe(37136.36);
    });
  });

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

    it('allows you to customize the % of previous withdrawal', () => {
      expect(
        ninetyFivePercentRule({
          isFirstYear: false,

          firstYearStartPortolioTotalValue: 100000,
          portfolioTotalValue: 50000,
          initialWithdrawalRate: 0.04,

          previousYearWithdrawalAmount: 4000,
          previousYearWithdrawalPercentage: 0.99,
        })
      ).toBe(3960);
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
