import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './multiple-simulations.css';
import MultipleOverview from './multiple-overview';
import OneCycle from './one-cycle';

export default function MultipleSimulations({ result }) {
  const [selectedStartYear, setSelectedStartYear] = useState(null);

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

  return (
    <>
      {selectedStartYear === null && (
        <MultipleOverview result={result} updateStartYear={updateStartYear} />
      )}
      {selectedStartYear && (
        <OneCycle
          goBack={() => setSelectedStartYear(null)}
          inputs={result.inputs}
          isSuccessful={!selectedStartYear.isFailed}
          cycle={selectedStartYear}
        />
      )}
    </>
  );
}
