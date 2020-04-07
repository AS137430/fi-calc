import _ from 'lodash';

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

export function greaterThanZero(val) {
  if (Number(val) <= 0) {
    return 'lessThanZero';
  }
}

export function integerRequired(val) {
  if (!Number.isInteger(Number(val))) {
    return 'nonInteger';
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

export function isValidHexCode(val) {
  // First, we ensure that the length is one of the valid lengths.
  if (val.length !== 2 && val.length !== 3 && val.length !== 6) {
    return {
      code: 'invalidHex',
    };
  }

  // Then we ensure that it is only comprised of valid characters
  if (!/^[0-9A-Fa-f]+$/i.test(val)) {
    return {
      code: 'invalidHex',
    };
  }
}
