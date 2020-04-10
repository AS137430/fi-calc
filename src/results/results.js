import React, { useMemo } from 'react';
import _ from 'lodash';
import './results.css';
import OneCycle from './one-cycle';
import MultipleSimulations from './multiple-simulations';
import computeResult from '../utils/compute-result';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

export default function Results() {
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: 'allHistory',
        lengthOfRetirement,
        spendingPlan,
        portfolio,
      });
    },
    /* eslint react-hooks/exhaustive-deps: "off" */
    [
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  return (
    <div className="results">
      {oneSimulation && (
        <OneCycle
          cycle={result.results.allCycles[0]}
          isSuccessful={result.summary === 'SUCCESSFUL'}
          inputs={result.inputs}
        />
      )}
      {!oneSimulation && <MultipleSimulations result={result} />}
    </div>
  );
}
