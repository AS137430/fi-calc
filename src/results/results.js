import React, { useState, useEffect } from 'react';
import './results.css';
import runSimulations from '../utils/run-simulations/run-simulations';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';
import SimulationsOverview from './simulations-overview';
import OneSimulation from './one-simulation';

// These could one day be app-level settings that users can configure
const DIP_PERCENTAGE = 0.9;
const SUCCESS_RATE_THRESHOLD = 0.95;

export default function Results({ goToConfig }) {
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const [computation, setComputation] = useState({
    result: null,
    duration: 0,
  });

  useEffect(
    () => {
      setTimeout(() => {
        const start = performance.now();
        runSimulations(
          {
            durationMode: 'allHistory',
            lengthOfRetirement,
            spendingPlan,
            portfolio,
            dipPercentage: DIP_PERCENTAGE,
            successRateThreshold: SUCCESS_RATE_THRESHOLD,
          },
          result => {
            setComputation({
              result,
              duration: performance.now() - start,
            });
          }
        );
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

  const { result } = computation;

  // This powers the "navigation" of the results. We're not using URLs
  // because the state is stored in-memory atm. Refreshing would wipe the
  // state, and without state persistence, there is no location to bookmark.
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  // When the result changes, then that means the user must have changed
  // the inputs. When that happens, we set the selected simulation
  // to null, which effectively "navigates" us back to the overview.
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

  window.computation = computation;

  return (
    <div className="results">
      {result && (
        <>
          {selectedSimulation === null && (
            <SimulationsOverview
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
        </>
      )}
    </div>
  );
}