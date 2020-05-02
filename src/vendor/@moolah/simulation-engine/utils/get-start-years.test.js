import getStartYears from './get-start-years';

describe('getStartYears', () => {
  describe('no arguments', () => {
    it('returns an empty array', () => {
      const startYears = getStartYears();

      expect(Array.isArray(startYears)).toBe(true);
      expect(startYears.length === 0).toBe(true);
      expect(startYears).toEqual([]);
    });
  });

  describe('passing in an array of years', () => {
    it('returns all years', () => {
      const allYears = [1871, 1872, 1873, 1874, 1875];

      const startYears = getStartYears(allYears);

      expect(Array.isArray(startYears)).toBe(true);
      expect(startYears.length === allYears.length).toBe(true);
      expect(startYears).toEqual(allYears);
    });
  });

  describe('duration argument', () => {
    it('returns only years that can act as start years for the duration specified', () => {
      // This represents 4 year-long intervals (1875 is the 5th number, but it is an endpoint
      // representing Jan 1875, not a full year)
      // Accordingly, only 2 of these years can be the start year for a 3-year long simulation
      const allYears = [1871, 1872, 1873, 1874, 1875];
      const startYears = getStartYears(allYears, { duration: 3 });
      expect(Array.isArray(startYears)).toBe(true);
      expect(startYears.length === 2).toBe(true);
      expect(startYears).toEqual([1871, 1872]);
    });
  });

  describe('firstYear / lastYear', () => {
    describe('no duration', () => {
      it('firstYear+lastYear, returns all years in that range', () => {
        const allYears = [1871, 1872, 1873, 1874, 1875];

        const startYears = getStartYears(allYears, {
          firstYear: 1872,
          lastYear: 1874,
        });

        expect(Array.isArray(startYears)).toBe(true);
        expect(startYears.length === 3).toBe(true);
        expect(startYears).toEqual([1872, 1873, 1874]);
      });

      it('does not work with just one or the other', () => {
        const allYears = [1871, 1872, 1873, 1874, 1875];

        const startYears = getStartYears(allYears, {
          firstYear: 1872,
        });

        expect(Array.isArray(startYears)).toBe(true);
        expect(startYears.length === allYears.length).toBe(true);
        expect(startYears).toEqual(allYears);
      });
    });

    it('also works with duration', () => {
      const allYears = [1871, 1872, 1873, 1874, 1875];

      const startYears = getStartYears(allYears, {
        duration: 2,
        firstYear: 1872,
        lastYear: 1874,
      });

      expect(Array.isArray(startYears)).toBe(true);
      expect(startYears.length === 1).toBe(true);
      expect(startYears).toEqual([1872]);
    });
  });
});
