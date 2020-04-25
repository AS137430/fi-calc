import formatForDisplay from './format-for-display';

export enum SmallDisplayMagnitude {
  short = 'short',
  medium = 'medium',
}

export interface SmallUnitValue {
  value: number | string;
  magnitude: string;
  prefix: string;
}

export default function smallDisplay(
  value: number,
  minimum: number = 3,
  magnitude: SmallDisplayMagnitude = SmallDisplayMagnitude.short
): SmallUnitValue {
  const rounded = Math.round(value);
  const positive = Math.abs(rounded);
  const val = String(positive);
  let prefix;
  if (rounded > 0) {
    prefix = '+';
  } else if (rounded < 0) {
    prefix = '-';
  } else {
    prefix = '';
  }

  const isShortMagnitude = magnitude === SmallDisplayMagnitude.short;

  if (val.length <= minimum) {
    return {
      value: Number(
        formatForDisplay(Number(val), { digits: 0, includeDollarSign: false })
      ),
      magnitude: '',
      prefix,
    };
  } else if (val.length === 4) {
    return {
      value: Number(val.slice(0, -2)) / 10,
      magnitude: isShortMagnitude ? 'k' : 'k',
      prefix,
    };
  } else if (val.length <= 6) {
    return {
      value: Number(val.slice(0, -3)),
      magnitude: isShortMagnitude ? 'k' : 'k',
      prefix,
    };
  } else if (val.length === 7) {
    return {
      value: Number(val.slice(0, -5)) / 10,
      magnitude: isShortMagnitude ? 'mil' : 'million',
      prefix,
    };
  } else if (val.length <= 9) {
    return {
      value: Number(val.slice(0, -6)),
      magnitude: isShortMagnitude ? 'mil' : 'million',
      prefix,
    };
  } else if (val.length === 10) {
    return {
      value: Number(val.slice(0, -8)) / 10,
      magnitude: isShortMagnitude ? 'bil' : 'billion',
      prefix,
    };
  } else if (val.length <= 12) {
    return {
      value: Number(val.slice(0, -9)),
      magnitude: isShortMagnitude ? 'bil' : 'billion',
      prefix,
    };
  } else {
    return {
      value: Number(val.slice(0, -12)),
      magnitude: '…',
      prefix,
    };
  }
}
