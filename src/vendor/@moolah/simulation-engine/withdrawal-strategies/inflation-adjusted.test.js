import inflationAdjusted from './inflation-adjusted';

describe('inflationAdjusted', () => {
  it('works', () => {
    expect(
      inflationAdjusted({
        inflation: 0.5,
        firstYearWithdrawal: 40000,
      })
    ).toBe(20000);

    expect(
      inflationAdjusted({
        inflation: 1,
        firstYearWithdrawal: 40000,
      })
    ).toBe(40000);

    expect(
      inflationAdjusted({
        inflation: 3,
        firstYearWithdrawal: 40000,
      })
    ).toBe(120000);

    expect(
      inflationAdjusted({
        inflation: 5,
        firstYearWithdrawal: 0,
      })
    ).toBe(0);
  });
});
