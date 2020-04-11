import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import './results.css';
import computeResult from '../utils/compute-result';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';
import MultipleOverview from './multiple-overview';
import OneCycle from './one-cycle';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

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
        dipPercentage: DIP_PERCENTAGE,
        successRateThreshold: SUCCESS_RATE_THRESHOLD,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(spendingPlan),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(lengthOfRetirement),
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function updateStartYear(cycle) {
    window.scrollTo(0, 0);
    setSelectedStartYear(cycle);
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
