import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import './results.css';
import computeResult from '../utils/compute-result';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';
import MultipleOverview from './multiple-overview';
import OneCycle from './one-cycle';

export default function Results({ goToConfig }) {
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();
  const [selectedStartYear, setSelectedStartYear] = useState(null);

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

  useEffect(
    () => {
      window.scrollTo(0, 0);
      setSelectedStartYear(null);
    },
    [result]
  );

  function updateStartYear(startYear) {
    window.scrollTo(0, 0);
    const target = _.find(result.results.allCycles, {
      startYear,
    });
    setSelectedStartYear(target);
  }

  console.log('hello', result);

  return (
    <div className="results">
      {selectedStartYear === null && (
        <MultipleOverview
          goToConfig={goToConfig}
          result={result}
          updateStartYear={updateStartYear}
        />
      )}
      {selectedStartYear && (
        <OneCycle
          goBack={() => {
            window.scrollTo(0, 0);
            setSelectedStartYear(null);
          }}
          inputs={result.inputs}
          isSuccessful={!selectedStartYear.isFailed}
          cycle={selectedStartYear}
        />
      )}
    </div>
  );
}
