import {
  isRequired,
  numberRequired,
  tooLarge,
  greaterThanZero,
} from '../utils/forms/validators';
import maxDollarInput from '../utils/forms/max-dollar-input';

export default {
  values: {
    annualSpending: {
      type: 'number',
      default: 40000,
      validators: [
        isRequired,
        numberRequired,
        greaterThanZero,
        tooLarge(maxDollarInput),
      ],
    },

    inflationAdjustedFirstYearWithdrawal: {
      type: 'boolean',
      default: true,
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
