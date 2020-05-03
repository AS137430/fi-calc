import notInflationAdjusted from './not-inflation-adjusted';

describe('notInflationAdjusted', () => {
  it('works', () => {
    expect(
      notInflationAdjusted({
        firstYearWithdrawal: 40000,
      })
    ).toBe(40000);

    expect(
      notInflationAdjusted({
        firstYearWithdrawal: 0,
      })
    ).toBe(0);
  });
});
