import portfolioPercent from './portfolio-percent';

describe('portfolioPercent', () => {
  it('works with no min/max', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
      }).value
    ).toBe(40000);
  });

  it('supports a minimum', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 50000,
      }).value
    ).toBe(50000);
  });

  it('supports a maximum', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        maxWithdrawal: 35000,
      }).value
    ).toBe(35000);
  });

  it('respects inflation for min', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        minWithdrawal: 50000,
      }).value
    ).toBe(50000);
  });

  it('respects inflation for max', () => {
    expect(
      portfolioPercent({
        portfolioTotalValue: 1000000,
        percentageOfPortfolio: 0.04,
        maxWithdrawal: 35000,
      }).value
    ).toBe(35000);
  });
});
