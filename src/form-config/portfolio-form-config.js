import { maxDollarInput } from '../vendor/@moolah/lib';
import {
  isRequired,
  numberRequired,
  tooLarge,
  tooSmall,
} from '../utils/forms/validators';

export default {
  values: {
    stockInvestmentValue: {
      type: 'number',
      default: 800000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    stockInvestmentFees: {
      type: 'number',
      default: 0.04,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    bondsValue: {
      type: 'number',
      default: 200000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    rebalancePortfolioAnnually: {
      type: 'boolean',
      default: true,
    },
  },
};
