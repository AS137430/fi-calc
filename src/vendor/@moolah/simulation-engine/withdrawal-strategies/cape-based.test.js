import capeBased from './cape-based';

describe('capeBased', () => {
  describe('no CAPE weight', () => {
    it('behaves the same as percent of portfolio', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual({
        value: 40000,
        meta: {
          baseWithdrawalRate: 0.4,
          capeBasedWithdrawalRate: 0,
          totalWithdrawalRate: 0.4,
          minWithdrawalMade: false,
          maxWithdrawalMade: false,
        },
      });
    });

    it('respects min withdrawal', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        minWithdrawal: 50000,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual({
        value: 50000,
        meta: {
          baseWithdrawalRate: 0.4,
          capeBasedWithdrawalRate: 0,
          totalWithdrawalRate: 0.4,
          minWithdrawalMade: true,
          maxWithdrawalMade: false,
        },
      });
    });

    it('respects max withdrawal', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.4,
        maxWithdrawal: 30000,
        cape: 25,
        capeWeight: 0,
      });

      expect(withdrawal).toEqual({
        value: 30000,
        meta: {
          baseWithdrawalRate: 0.4,
          capeBasedWithdrawalRate: 0,
          totalWithdrawalRate: 0.4,
          minWithdrawalMade: false,
          maxWithdrawalMade: true,
        },
      });
    });
  });

  describe('with cape weight', () => {
    it('returns the expected results', () => {
      const withdrawal = capeBased({
        portfolioTotalValue: 100000,
        withdrawalRate: 0.01,

        // CAEY = 1/25 = 0.04
        cape: 25,
        // CAEY * weight = 0.04 * 0.25 = 0.01
        // This combines with our withdrawal rate to yield 0.02,
        // or $2k
        capeWeight: 0.25,
      });

      expect(withdrawal).toEqual({
        value: 2000,
        meta: {
          baseWithdrawalRate: 0.01,
          capeBasedWithdrawalRate: 0.01,
          totalWithdrawalRate: 0.02,
          minWithdrawalMade: false,
          maxWithdrawalMade: false,
        },
      });
    });
  });
});
