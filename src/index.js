import 'focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ErrorBoundary from './error-boundary';
import { SpendingPlanProvider } from './state/spending-plan';
import { CalculatorModeContext } from './state/calculator-mode';
import { settingsFromLocation } from './vendor/forms';
import spendingPlanFrom from './form-config/spending-plan-form';

const defaultSpendingPlanValues = settingsFromLocation(
  window.location,
  spendingPlanFrom.values
);

ReactDOM.render(
  <ErrorBoundary>
    <SpendingPlanProvider defaultValues={defaultSpendingPlanValues}>
      <CalculatorModeContext>
        <App />
      </CalculatorModeContext>
    </SpendingPlanProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
