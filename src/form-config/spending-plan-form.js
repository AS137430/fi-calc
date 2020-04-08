import {
  isRequired,
  numberRequired,
  tooLarge,
  tooSmall,
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
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    percentageOfPortfolio: {
      type: 'number',
      default: 4,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    minWithdrawalLimit: {
      type: 'number',
      default: 35000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    maxWithdrawalLimit: {
      type: 'number',
      default: 60000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
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
