import React, { useMemo } from 'react';
import './results.css';
import MultipleSimulations from './multiple-simulations';
import computeResult from '../utils/compute-result';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

export default function Results({ goToConfig }) {
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

  return (
    <div className="results">
      <MultipleSimulations result={result} goToConfig={goToConfig} />
    </div>
  );
}
