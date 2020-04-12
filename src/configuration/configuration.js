import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import IconRepeat from 'materialish/icon-repeat';
import './configuration.css';
import LengthOfRetirementConfig from './length-of-retirement-config';
import SpendingPlanConfig from './spending-plan-config';
import PortfolioConfig from './portfolio-config';
import useIsSmallScreen from '../hooks/use-is-small-screen';

export default function Configuration() {
  const isSmallScreen = useIsSmallScreen();
  const { pathname } = useLocation();

  // To support the...atypical routing in this app, we always include this component in the
  // React tree, but we only actually render to the DOM on small screens when a particular path
  // matches.
  if (isSmallScreen && pathname !== '/') {
    return null;
  }

  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <div>
        <LengthOfRetirementConfig />
        <SpendingPlanConfig />
        <PortfolioConfig />
      </div>
      {isSmallScreen && (
        <div className="configuration_viewResults">
          <Link to="/results" className="button button-primary">
            <IconRepeat fill="white" size="1.1rem" />
            Run Simulations
          </Link>
        </div>
      )}
    </div>
  );
}
