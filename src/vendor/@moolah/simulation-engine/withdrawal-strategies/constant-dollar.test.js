import constantDollar from './constant-dollar';

describe('constantDollar', () => {
  describe('adjustForInflation: true', () => {
    it('works', () => {
      expect(
        constantDollar({
          inflation: 0.5,
          firstYearWithdrawal: 40000,
        }).value
      ).toBe(20000);

      expect(
        constantDollar({
          inflation: 1,
          firstYearWithdrawal: 40000,
        }).value
      ).toBe(40000);

      expect(
        constantDollar({
          inflation: 3,
          firstYearWithdrawal: 40000,
        }).value
      ).toBe(120000);

      expect(
        constantDollar({
          inflation: 5,
          firstYearWithdrawal: 0,
        }).value
      ).toBe(0);
    });
  });

  describe('adjustForInflation: false', () => {
    it('works', () => {
      expect(
        constantDollar({
          adjustForInflation: false,
          firstYearWithdrawal: 40000,
        }).value
      ).toBe(40000);

      expect(
        constantDollar({
          adjustForInflation: false,
          firstYearWithdrawal: 0,
        }).value
      ).toBe(0);
    });
  });
});
