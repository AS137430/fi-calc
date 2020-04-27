import React from 'react';
import { Link } from 'react-router-dom';
import IconRepeat from 'materialish/icon-repeat';
import './configuration.css';
import LengthOfRetirementForm from './length-of-retirement-form';
import WithdrawalStrategyForm from './withdrawal-strategy-form';
import PortfolioForm from './portfolio-form';
import HistoricalDataRangeForm from './historical-data-range-form';
import AdditionalWithdrawalsForm from './additional-adjustments/additional-withdrawals-form';
import AdditionalIncomeForm from './additional-adjustments/additional-income-form';
import useIsSmallScreen from '../hooks/use-is-small-screen';

export default function Configuration() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="configuration">
      <h1 className="configuration_title">Configuration</h1>
      <div>
        <LengthOfRetirementForm />
        <PortfolioForm />
        <WithdrawalStrategyForm />
        <HistoricalDataRangeForm />
        <AdditionalIncomeForm />
        <AdditionalWithdrawalsForm />
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
