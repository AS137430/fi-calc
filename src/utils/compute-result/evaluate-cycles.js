import _ from 'lodash';
import { mean, deviation, createGaussian } from './gaussian';

export default function evaluateCycles({ cycles }) {
  // For now, we only consider completed cycles
  // An incomplete cycle is one that doesn't have enough years to meet the
  // duration requirement that we specified
  const completedCycles = _.filter(cycles, 'isComplete');

  // If nothing completed, then we have nothing to analyze
  if (!completedCycles.length) {
    return {};
  }

  const percentChanges = completedCycles
    .map(cycle => cycle.percentOfChange)
    .filter(Boolean);
  const computedMean = mean(percentChanges);
  const stdDeviation = deviation(percentChanges);
  const gaussian = createGaussian(computedMean, stdDeviation);

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
    gaussian,
    numberOfCycles: completedCycles.length,
    successRate,
    dipRate,
    lowestDippedValue,
    mean: computedMean,
    standardDeviation: stdDeviation,
  };
}
