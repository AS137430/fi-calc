const falseMap = ['0', 'false', 'fals', 'f', 'no'];

export function boolean(val) {
  if (typeof val !== 'undefined' && falseMap.includes(val)) {
    return false;
  } else {
    return true;
  }
}

export function number(val, settingConfig) {
  const possibleValue = Number(val);

  if (Number.isNaN(possibleValue)) {
    return settingConfig.default || null;
  }

  return Number(possibleValue);
}

export function string(val) {
  return val;
}

export function enumeration(val, settingConfig) {
  const values = settingConfig.values || [];

  const simpleValues = values.map(v => {
    if (typeof v === 'object') {
      return v.value;
    } else {
      return v;
    }
  });

  if (simpleValues.includes(val)) {
    return val;
  } else {
    return settingConfig.default;
  }
}
