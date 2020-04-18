import React from 'react';
import './sidebar.css';
import Configuration from '../configuration/configuration';
import useIsCalculator from '../hooks/use-is-calculator';
import useIsSmallScreen from '../hooks/use-is-small-screen';

export default function Sidebar() {
  const isCalculator = useIsCalculator();
  const isSmallScreen = useIsSmallScreen();

  if (!isCalculator || isSmallScreen) {
    return null;
  }

  return (
    <div className="sidebar">
      <Configuration />
    </div>
  );
}
