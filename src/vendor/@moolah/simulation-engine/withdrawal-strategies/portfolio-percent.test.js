import portfolioPercent from './portfolio-percent';

describe('portfolioPercent', () => {
  it('works with no min/max', () => {
    expect(
      portfolioPercent({
        inflation: 1,
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 0,
        maxWithdrawal: Number.MAX_SAFE_INTEGER,
      })
    ).toBe(40000);
  });

  it('supports a minimum', () => {
    expect(
      portfolioPercent({
        inflation: 1,
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 50000,
        maxWithdrawal: Number.MAX_SAFE_INTEGER,
      })
    ).toBe(50000);
  });

  it('supports a maximum', () => {
    expect(
      portfolioPercent({
        inflation: 1,
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 0,
        maxWithdrawal: 35000,
      })
    ).toBe(35000);
  });

  it('respects inflation for min', () => {
    expect(
      portfolioPercent({
        inflation: 0.5,
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 100000,
        maxWithdrawal: Number.MAX_SAFE_INTEGER,
      })
    ).toBe(50000);
  });

  it('respects inflation for max', () => {
    expect(
      portfolioPercent({
        inflation: 0.5,
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 0,
        maxWithdrawal: 70000,
      })
    ).toBe(35000);
  });
});
