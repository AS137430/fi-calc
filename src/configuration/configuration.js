import React from 'react';
import './configuration.css';
import LengthOfRetirementConfig from './length-of-retirement-config';
import SpendingPlanConfig from './spending-plan-config';
import PortfolioConfig from './portfolio-config';

export default function Configuration() {
  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <LengthOfRetirementConfig />
      <SpendingPlanConfig />
      <PortfolioConfig />
    </div>
  );
}
