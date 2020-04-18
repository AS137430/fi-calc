import React from 'react';
import { Link } from 'react-router-dom';
import IconRepeat from 'materialish/icon-repeat';
import './configuration.css';
import LengthOfRetirementConfig from './length-of-retirement-config';
import WithdrawalPlanConfig from './withdrawal-plan-config';
import PortfolioConfig from './portfolio-config';
import HistoricalData from './historical-data-config';
import useIsSmallScreen from '../hooks/use-is-small-screen';

export default function Configuration() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <div>
        <LengthOfRetirementConfig />
        <PortfolioConfig />
        <WithdrawalPlanConfig />
        <HistoricalData />
      </div>
      {isSmallScreen && (
        <div className="configuration_viewResults">
          <Link to="/calculator/results" className="button button-primary">
            <IconRepeat fill="white" size="1.1rem" />
            Run Simulations
          </Link>
        </div>
      )}
    </div>
  );
}
