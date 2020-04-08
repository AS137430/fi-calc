import _ from 'lodash';
import { mean, deviation } from './gaussian';

export default function evaluateCycles({ cycles }) {
  // For now, we only consider completed cycles
  // An incomplete cycle is one that doesn't have enough years to meet the
  // duration requirement that we specified
  const completedCycles = _.filter(cycles, 'isComplete');

  // If nothing completed, then we have nothing to analyze
  if (!completedCycles.length) {
    return {};
  }

  const finalValues = completedCycles.map(cycle => cycle.normalizedFinalValue);
  const computedMean = mean(finalValues);
  const stdDeviation = deviation(finalValues);

  const successfulCycles = _.reject(completedCycles, 'isFailed');
  const dippedCycles = _.filter(completedCycles, 'didDip');

  const succeededAndDippedCycles = _.intersection(
    successfulCycles,
    dippedCycles
  );

  const lowestDippedValues = _.map(
    succeededAndDippedCycles,
    'lowestSuccessfulDip'
  );

  const lowestDippedValue = _.minBy(lowestDippedValues, 'value');

  const successRate = successfulCycles.length / completedCycles.length;
  const dipRate = dippedCycles.length / completedCycles.length;

  return {
    allCycles: completedCycles,
    dippedCycles,
    successfulCycles,
    numberOfCycles: completedCycles.length,
    successRate,
    dipRate,
    lowestDippedValue,
    mean: computedMean,
    standardDeviation: stdDeviation,
  };
}
