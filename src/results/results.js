import React, { useMemo } from 'react';
import _ from 'lodash';
import './results.css';
import OneCycle from './one-cycle';
import MultipleSimulations from './multiple-simulations';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

export default function Results() {
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: calculatorMode,
        lengthOfRetirement,
        spendingPlan,
        portfolio,
      });
    },
    /* eslint react-hooks/exhaustive-deps: "off" */
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  return (
    <div className="results">
      <h1 className="results_title">Results</h1>
      {oneSimulation && (
        <OneCycle
          cycle={result.results.allCycles[0]}
          summary={result.summary}
          inputs={result.inputs}
        />
      )}
      {!oneSimulation && <MultipleSimulations result={result} />}
    </div>
  );
}
