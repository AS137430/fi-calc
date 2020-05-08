import {
  fromInvestments,
  fromTotalAndPercentages,
} from './normalize-portfolio-definition';
import { InvestmentType } from '../types';

interface FromInvestmentsInvestment {
  type: InvestmentType;
  fees: number;
  value: number;
}

interface FromTotalAndPercentagesInvestment {
  type: InvestmentType;
  fees: number;
  percentage: number;
}

describe('normalizePortfolioDefinition', () => {
  describe('fromTotalAndPercentages', () => {
    it('works', () => {
      const investments: FromTotalAndPercentagesInvestment[] = [
        {
          type: 'equity',
          fees: 0.04,
          percentage: 0.75,
        },
        {
          type: 'bonds',
          fees: 0,
          percentage: 0.25,
        },
      ];

      const result = fromTotalAndPercentages({
        totalValue: 100000,
        investments,
      });

      expect(result).toEqual({
        totalValue: 100000,
        investments: [
          {
            type: 'equity',
            fees: 0.04,
            value: 75000,
            percentage: 0.75,
          },
          {
            type: 'bonds',
            fees: 0,
            value: 25000,
            percentage: 0.25,
          },
        ],
      });
    });
  });

  describe('fromInvestments', () => {
    it('works', () => {
      const investments: FromInvestmentsInvestment[] = [
        {
          type: 'equity',
          fees: 0.04,
          value: 75000,
        },
        {
          type: 'bonds',
          fees: 0,
          value: 25000,
        },
      ];

      const result = fromInvestments({
        investments,
      });

      expect(result).toEqual({
        totalValue: 100000,
        investments: [
          {
            type: 'equity',
            fees: 0.04,
            value: 75000,
            percentage: 0.75,
          },
          {
            type: 'bonds',
            fees: 0,
            value: 25000,
            percentage: 0.25,
          },
        ],
      });
    });
  });
});
