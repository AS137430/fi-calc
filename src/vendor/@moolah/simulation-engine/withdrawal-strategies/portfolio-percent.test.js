import portfolioPercent from './portfolio-percent';

describe('portfolioPercent', () => {
  it('works with no min/max', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
      })
    ).toEqual({
      value: 40000,
      meta: {
        minWithdrawalMade: false,
        maxWithdrawalMade: false,
      },
    });
  });

  it('supports a minimum', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 50000,
      })
    ).toEqual({
      value: 50000,
      meta: {
        minWithdrawalMade: true,
        maxWithdrawalMade: false,
      },
    });
  });

  it('supports a maximum', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        maxWithdrawal: 35000,
      })
    ).toEqual({
      value: 35000,
      meta: {
        minWithdrawalMade: false,
        maxWithdrawalMade: true,
      },
    });
  });
});
