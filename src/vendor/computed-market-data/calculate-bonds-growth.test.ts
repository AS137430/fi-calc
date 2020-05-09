import calculateBondsGrowth from './calculate-bonds-growth';

describe('calculateBondsGrowth', () => {
  // This is Bo's original test case in the thread:
  //
  // > -In 1979 GS10 was 9.1%
  // > - In 1980 it was 10.8%.
  // >
  // > So the GS10 return for 1979 would be -1%, not 9.1% due to the
  // > price change of the bonds cause by rates rising during the year.
  it('should return the expected value', () => {
    const growth =
      calculateBondsGrowth({
        currentYearLir: 0.091,
        nextYearLir: 0.108,
        duration: 10,
      }) * 100;

    expect(growth).toBeCloseTo(-1);
  });

  // These are test cases from Aswath Damodaran's data set
  it('should return the expected value', () => {
    expect(
      calculateBondsGrowth({
        // 1927
        currentYearLir: 0.0317,
        // 1928
        nextYearLir: 0.0345,
        duration: 10,
      }) * 100
      // This is listed in the return in 1928
    ).toBeCloseTo(0.84);

    expect(
      calculateBondsGrowth({
        // 1930
        currentYearLir: 0.0322,
        // 1931
        nextYearLir: 0.0393,
        duration: 10,
      }) * 100
      // This is listed in the return in 1931
    ).toBeCloseTo(-2.56);
  });

  // "A 10 year @9.1% @$100 in 1979 becomes a 9 year @10.8% @$90.51 in 1980,
  // plus interest 9.1%, for a total return of -0.39%."
  it('should return the expected value', () => {
    expect(
      calculateBondsGrowth({
        currentYearLir: 0.091,
        nextYearLir: 0.108,
      }) * 100
      // -0.3866047212744861
    ).toBeCloseTo(-0.39);
  });
});
