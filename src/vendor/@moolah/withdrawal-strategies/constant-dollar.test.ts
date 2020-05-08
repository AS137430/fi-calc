import constantDollar from './constant-dollar';

describe('constantDollar', () => {
  describe('adjustForInflation: true', () => {
    it('works', () => {
      expect(
        constantDollar({
          inflation: 0.5,
          firstYearWithdrawal: 40000,
        })
      ).toEqual({
        value: 20000,
        meta: null,
      });

      expect(
        constantDollar({
          inflation: 1,
          firstYearWithdrawal: 40000,
        })
      ).toEqual({
        value: 40000,
        meta: null,
      });

      expect(
        constantDollar({
          inflation: 3,
          firstYearWithdrawal: 40000,
        })
      ).toEqual({
        value: 120000,
        meta: null,
      });

      expect(
        constantDollar({
          inflation: 5,
          firstYearWithdrawal: 0,
        })
      ).toEqual({
        value: 0,
        meta: null,
      });
    });
  });

  describe('adjustForInflation: false', () => {
    it('works', () => {
      expect(
        constantDollar({
          adjustForInflation: false,
          firstYearWithdrawal: 40000,
        })
      ).toEqual({
        value: 40000,
        meta: null,
      });

      expect(
        constantDollar({
          adjustForInflation: false,
          firstYearWithdrawal: 0,
        })
      ).toEqual({
        value: 0,
        meta: null,
      });
    });
  });
});
