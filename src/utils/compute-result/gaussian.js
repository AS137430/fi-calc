export function mean(values) {
  let count = 0;
  let sum = 0;
  for (let value of values) {
    if (value != null && (value = +value) >= value) {
      ++count, (sum += value);
    }
  }
  if (count) return sum / count;
}

export function variance(values, valueof) {
  let count = 0;
  let delta;
  let mean = 0;
  let sum = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if (
        (value = valueof(value, ++index, values)) != null &&
        (value = +value) >= value
      ) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  }
  if (count > 1) return sum / (count - 1);
}

export function deviation(values, valueof) {
  const v = variance(values, valueof);
  return v ? Math.sqrt(v) : v;
}
