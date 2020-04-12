import getStartYears from './get-start-years';

describe('getStartYears', () => {
  describe('no argument', () => {
    it('returns all years', () => {
      const startYears = getStartYears();
      expect(Array.isArray(startYears)).toBe(true);
      // This number will succeed if the algo is right, but is also flexible enough to support
      // more data being added later on.
      expect(startYears.length > 100).toBe(true);
      expect(startYears).toEqual(
        expect.arrayContaining([1871, 1900, 1901, 1902, 2020])
      );
    });
  });

  describe('duration argument', () => {
    // For instance, if you specify 10 years, and the latest year is 2020, then you'll only
    // receive up to 2010.
    it('returns only years that can act as start years for the duration specified', () => {
      const startYears = getStartYears(30);
      expect(Array.isArray(startYears)).toBe(true);
      expect(startYears.length > 70).toBe(true);
      expect(startYears).toEqual(
        expect.arrayContaining([1871, 1900, 1901, 1902, 1990])
      );

      // NOTE: fix this by incrementing it by +1 each time a new year is added
      expect(startYears).toEqual(expect.not.arrayContaining([1991]));
    });
  });
});
