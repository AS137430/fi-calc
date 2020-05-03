import inflationAdjusted from './inflation-adjusted';

describe('inflationAdjusted', () => {
  it('works', () => {
    expect(
      inflationAdjusted({
        inflation: 0.5,
        firstYearWithdrawal: 40000,
      }).value
    ).toBe(20000);

    expect(
      inflationAdjusted({
        inflation: 1,
        firstYearWithdrawal: 40000,
      }).value
    ).toBe(40000);

    expect(
      inflationAdjusted({
        inflation: 3,
        firstYearWithdrawal: 40000,
      }).value
    ).toBe(120000);

    expect(
      inflationAdjusted({
        inflation: 5,
        firstYearWithdrawal: 0,
      }).value
    ).toBe(0);
  });
});
