export default function linearScale(
  { domain = [0, 1], range = [0, 1], value = 0 } = {
    domain: [0, 1],
    range: [0, 1],
    value: 0,
  }
) {
  if (domain[0] === domain[1]) {
    return domain[0];
  }

  const slope = (range[1] - range[0]) / (domain[1] - domain[0]);

  return slope * (value - domain[0]) + range[0];
}
