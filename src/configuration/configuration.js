import React from 'react';
import './configuration.css';
import LengthOfRetirement from './length-of-retirement';
import SpendingPlan from './spending-plan';
import Portfolio from './portfolio';

export default function Configuration() {
  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <LengthOfRetirement />
      <SpendingPlan />
      <Portfolio />
    </div>
  );
}
