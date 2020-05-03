import capeBased from './cape-based';

describe('capeBased', () => {
  describe('no CAPE weight', () => {
    it('behaves the same as percent of portfolio', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        inflation: 1,
        minWithdrawal: 0,
        maxWithdrawal: Infinity,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual(40000);
    });

    it('respects min withdrawal', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        inflation: 1,
        minWithdrawal: 50000,
        maxWithdrawal: Infinity,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual(50000);
    });

    it('respects max withdrawal', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        inflation: 1,
        minWithdrawal: 0,
        maxWithdrawal: 30000,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual(30000);
    });
  });

  describe('with cape weight', () => {
    it('returns the expected results', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.01,
        inflation: 1,
        minWithdrawal: 0,
        maxWithdrawal: Infinity,

        // CAEY = 1/25 = 0.04
        cape: 25,
        // CAEY * weight = 0.04 * 0.25 = 0.01
        // This combines with our withdrawal rate to yield 0.02,
        // or $2k
        capeWeight: 0.25,
      });

      expect(withdrawal).toEqual(2000);
    });
  });
});
