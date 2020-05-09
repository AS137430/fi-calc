import calculateBondsGrowth from './calculate-bonds-growth';

describe('calculateBondsGrowth', () => {
  //   -In 1979 GS10 was 9.1%
  // - In 1980 it was 10.8%.
  it('should return the expected value', () => {
    const growth = calculateBondsGrowth({
      currentYearLir: 0.0317,
      nextYearLir: 0.0345,
    });

    expect(growth).toBe(0.0084);
  });
});
