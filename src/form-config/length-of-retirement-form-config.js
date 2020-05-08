import {
  isRequired,
  numberRequired,
  integerRequired,
  greaterThanZero,
} from '../utils/forms/validators';

export default {
  values: {
    numberOfYears: {
      type: 'number',
      default: 30,
      validators: [
        isRequired,
        numberRequired,
        integerRequired,
        greaterThanZero,
      ],
    },
  },
};
