import {
  isRequired,
  tooLarge,
  greaterThanZero,
} from '../utils/forms/validators';

export default {
  values: {
    annualSpending: {
      type: 'number',
      default: 40000,
      validators: [isRequired, greaterThanZero, tooLarge(10000000)],
    },

    spendingStrategy: {
      type: 'enumeration',
      keyType: 'string',
      values: [
        {
          key: 'constantSpending',
          display: 'Constant Spending',
        },
        {
          key: 'portfolioPercent',
          display: 'Percent of Portfolio',
        },
        {
          key: 'hebeler',
          display: 'Hebeler Autopilot',
        },
      ],
    },
  },
};
