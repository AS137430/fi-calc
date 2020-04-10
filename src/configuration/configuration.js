import React from 'react';
import IconRepeat from 'materialish/icon-repeat';
import './configuration.css';
import LengthOfRetirementConfig from './length-of-retirement-config';
import SpendingPlanConfig from './spending-plan-config';
import PortfolioConfig from './portfolio-config';

export default function Configuration({ goToResults }) {
  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <div>
        <LengthOfRetirementConfig />
        <SpendingPlanConfig />
        <PortfolioConfig />
      </div>
      {typeof goToResults === 'function' && (
        <div className="configuration_viewResults">
          <button
            type="button"
            className="button button-primary"
            onClick={goToResults}>
            <IconRepeat fill="white" size="1.1rem" />
            Run Simulations
          </button>
        </div>
      )}
    </div>
  );
}
