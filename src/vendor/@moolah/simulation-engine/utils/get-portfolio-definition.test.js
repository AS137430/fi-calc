import getPortfolioDefinition from './get-portfolio-definition';

describe('getPortfolioDefinition', () => {
  it('works with 100% stocks', () => {
    const portfolioForm = {
      bondsValue: 0,
      stockInvestmentValue: 10000,
      stockInvestmentFees: 0.04,
    };

    const portfolio = getPortfolioDefinition({ portfolioForm });
    expect(portfolio).toEqual({
      totalValue: 10000,
      totalValueInFirstYearDollars: NaN,
      investments: [
        {
          type: 'equity',
          percentage: 1,
          fees: 0.0004,
          value: 10000,
        },
        {
          type: 'bonds',
          percentage: 0,
          fees: 0,
          value: 0,
        },
      ],
    });
  });

  it('works with 75/25 equities/bonds', () => {
    const portfolioForm = {
      bondsValue: 25000,
      stockInvestmentValue: 75000,
      stockInvestmentFees: 0.04,
    };

    const portfolio = getPortfolioDefinition({ portfolioForm });
    expect(portfolio).toEqual({
      totalValue: 100000,
      totalValueInFirstYearDollars: NaN,
      investments: [
        {
          type: 'equity',
          percentage: 0.75,
          fees: 0.0004,
          value: 75000,
        },
        {
          type: 'bonds',
          percentage: 0.25,
          fees: 0,
          value: 25000,
        },
      ],
    });
  });

  it('works with 100% bonds', () => {
    const portfolioForm = {
      bondsValue: 25000,
      stockInvestmentValue: 0,
      stockInvestmentFees: 0.04,
    };

    const portfolio = getPortfolioDefinition({ portfolioForm });
    expect(portfolio).toEqual({
      totalValue: 25000,
      totalValueInFirstYearDollars: NaN,
      investments: [
        {
          type: 'equity',
          percentage: 0,
          fees: 0.0004,
          value: 0,
        },
        {
          type: 'bonds',
          percentage: 1,
          fees: 0,
          value: 25000,
        },
      ],
    });
  });
});
