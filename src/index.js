import 'focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ErrorBoundary from './error-boundary';
import { LengthOfRetirementProvider } from './state/length-of-retirement';
import { SpendingPlanProvider } from './state/spending-plan';
import { PortfolioProvider } from './state/portfolio';
import { CalculatorModeContext } from './state/calculator-mode';
import { settingsFromLocation } from './vendor/forms';
import portfolioForm from './form-config/portfolio-form';
import spendingPlanForm from './form-config/spending-plan-form';
import lengthOfRetirementForm from './form-config/length-of-retirement-form';

// TODO: move these into the state files
const defaultPortfolioValues = settingsFromLocation(
  window.location,
  portfolioForm.values
);

const defaultSpendingPlanValues = settingsFromLocation(
  window.location,
  spendingPlanForm.values
);

const defaultLengthOfRetirementValues = settingsFromLocation(
  window.location,
  lengthOfRetirementForm.values
);

ReactDOM.render(
  <ErrorBoundary>
    <PortfolioProvider defaultValues={defaultPortfolioValues}>
      <LengthOfRetirementProvider
        defaultValues={defaultLengthOfRetirementValues}>
        <SpendingPlanProvider defaultValues={defaultSpendingPlanValues}>
          <CalculatorModeContext>
            <App />
          </CalculatorModeContext>
        </SpendingPlanProvider>
      </LengthOfRetirementProvider>
    </PortfolioProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
