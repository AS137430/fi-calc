import { maxDollarInput } from '../vendor/@moolah/lib';
import {
  isRequired,
  numberRequired,
  tooLarge,
  tooSmall,
} from '../utils/forms/validators';

export default {
  values: {
    withdrawalStrategyName: {
      type: 'enumeration',
      keyType: 'string',
      values: [
        {
          key: 'constantDollar',
          display: 'Constant Dollar',
        },
        {
          key: 'portfolioPercent',
          display: 'Percent of Portfolio',
        },
        {
          key: 'gk',
          display: 'Guyton-Klinger',
        },
        {
          key: '95percent',
          display: '95% Rule',
        },
        {
          key: 'capeBased',
          display: 'CAPE-based',
        },
        {
          key: 'dynamicSwr',
          display: 'Nesteggly Dynamic SWR',
        },

        // {
        //   key: 'hebeler',
        //   display: 'Hebeler autopilot',
        // },
      ],
    },

    /* Constant dollar */
    annualWithdrawal: {
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
      default: false,
    },

    minWithdrawalLimit: {
      type: 'number',
      default: 20000,
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
    gkInitialWithdrawal: {
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

    /* 95% Rule */

    // This is a bad name as it's the rate used each year
    ninetyFiveInitialRate: {
      type: 'number',
      default: 4,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    ninetyFivePercentage: {
      type: 'number',
      default: 95,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    /* CAPE */
    // Formula: (a + b * CAEY) * portfolioValue
    // where:
    //   a = capeWithdrawalRate
    //   b = capeWeight
    capeWithdrawalRate: {
      type: 'number',
      default: 1,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    capeWeight: {
      type: 'number',
      default: 0.5,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    /* Dynamic SWR */
    dynamicSwrRoiAssumption: {
      type: 'number',
      default: 6,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },

    dynamicSwrInflationAssumption: {
      type: 'number',
      default: 2,
      validators: [isRequired, numberRequired, tooSmall(0), tooLarge(100)],
    },
  },
};
