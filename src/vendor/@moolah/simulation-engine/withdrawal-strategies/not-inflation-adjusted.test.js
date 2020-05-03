import notInflationAdjusted from './not-inflation-adjusted';

describe('notInflationAdjusted', () => {
  it('works', () => {
    expect(
      notInflationAdjusted({
        firstYearWithdrawal: 40000,
      }).value
    ).toBe(40000);

    expect(
      notInflationAdjusted({
        firstYearWithdrawal: 0,
      }).value
    ).toBe(0);
  });
});
