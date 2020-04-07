import _ from 'lodash';
import maxDollarInput from './max-dollar-input';
import getYearRange from '../market-data/get-year-range';

export function isRequired(val) {
  if (typeof val === 'string' && val.length === 0) {
    return 'empty';
  }
}

export function numberRequired(val) {
  const valueToVerify = Number(val);

  if (!_.isFinite(valueToVerify)) {
    return 'NaN';
  }
}

export function lessThanEndYear(val, inputs) {
  if (Number(inputs.endYear.value) < Number(val)) {
    return 'greaterThanEndYear';
  }
}

export function greaterThanStartYear(val, inputs) {
  if (Number(inputs.startYear.value) > Number(val)) {
    return 'lessThanStartYear';
  }
}

export function greaterThanZero(val) {
  if (Number(val) <= 0) {
    return 'lessThanZero';
  }
}

export function withinDollarLimit(val) {
  if (Number(val) > maxDollarInput) {
    return 'tooManyDollars';
  }
}

export function integerRequired(val) {
  if (!Number.isInteger(Number(val))) {
    return 'nonInteger';
  }
}

export function withinYearLimit(val) {
  const { minYear, maxYear } = getYearRange();

  const year = Number(val);
  if (year > maxYear) {
    return 'yearTooLarge';
  } else if (year < minYear) {
    return 'yearTooSmall';
  }
}

export function tooLarge(limit) {
  return val => {
    if (Number(val) > limit) {
      return {
        code: 'tooLarge',
        limit,
      };
    }
  };
}

export function tooSmall(limit) {
  return val => {
    if (Number(val) < limit) {
      return {
        code: 'tooSmall',
        limit,
      };
    }
  };
}

export function dollarsTooLarge(limit) {
  return val => {
    if (Number(val) > limit) {
      return {
        code: 'dollarsTooLarge',
        limit,
      };
    }
  };
}

export function dollarsTooSmall(limit) {
  return val => {
    if (Number(val) < limit) {
      return {
        code: 'dollarsTooSmall',
        limit,
      };
    }
  };
}
