import {
  isRequired,
  numberRequired,
  tooLarge,
  tooSmall,
} from '../utils/forms/validators';
import maxDollarInput from '../utils/forms/max-dollar-input';

export default {
  values: {
    spendingStrategy: {
      type: 'enumeration',
      keyType: 'string',
      values: [
        {
          key: 'constantSpending',
          display: 'Constant withdrawal',
        },
        {
          key: 'portfolioPercent',
          display: 'Percent of portfolio',
        },
        {
          key: 'gk',
          display: 'Guyton-Klinger',
        },
        // {
        //   key: 'hebeler',
        //   display: 'Hebeler autopilot',
        // },
      ],
    },

    /* Constant withdrawal */
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

    /* Percent of portfolio */
    percentageOfPortfolio: {
      type: 'number',
      default: 4,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    minWithdrawalLimitEnabled: {
      type: 'boolean',
      default: true,
    },

    maxWithdrawalLimitEnabled: {
      type: 'boolean',
      default: true,
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

    /* Guyton-Klinger */
    gkInitialSpending: {
      type: 'number',
      default: 40000,
      validators: [
        isRequired,
        numberRequired,
        tooSmall(0),
        tooLarge(maxDollarInput),
      ],
    },

    gkWithdrawalUpperLimit: {
      type: 'number',
      default: 20,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    gkWithdrawalLowerLimit: {
      type: 'number',
      default: 20,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    gkUpperLimitAdjustment: {
      type: 'number',
      default: 10,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    gkLowerLimitAdjustment: {
      type: 'number',
      default: 10,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    gkModifiedWithdrawalRule: {
      type: 'boolean',
      default: true,
    },

    gkIgnoreLastFifteenYears: {
      type: 'boolean',
      default: false,
    },
  },
};
