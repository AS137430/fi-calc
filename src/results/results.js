import React, { useMemo, useState, useEffect } from 'react';
import './results.css';
import runSimulations from '../utils/run-simulations/run-simulations';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';
import MultipleOverview from './multiple-overview';
import OneSimulation from './one-simulation';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

export default function Results({ goToConfig }) {
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const result = useMemo(
    () => {
      // const start = performance.now();
      const result = runSimulations({
        durationMode: 'allHistory',
        lengthOfRetirement,
        spendingPlan,
        portfolio,
        dipPercentage: DIP_PERCENTAGE,
        successRateThreshold: SUCCESS_RATE_THRESHOLD,
      });
      // console.log('wot', performance.now() - start);

      return result;
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
      setSelectedSimulation(null);
    },
    [result]
  );

  function updateStartYear(simulation) {
    window.scrollTo(0, 0);
    setSelectedSimulation(simulation);
  }

  console.log('hello', result);

  return (
    <div className="results">
      {selectedSimulation === null && (
        <MultipleOverview
          goToConfig={goToConfig}
          result={result}
          updateStartYear={updateStartYear}
        />
      )}
      {selectedSimulation && (
        <OneSimulation
          goBack={() => {
            window.scrollTo(0, 0);
            setSelectedSimulation(null);
          }}
          inputs={result.inputs}
          simulation={selectedSimulation}
        />
      )}
    </div>
  );
}
