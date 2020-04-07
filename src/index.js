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
import { CalculatorModeContext } from './state/calculator-mode';
import { settingsFromLocation } from './vendor/forms';
import spendingPlanForm from './form-config/spending-plan-form';
import lengthOfRetirementForm from './form-config/length-of-retirement-form';

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
    <LengthOfRetirementProvider defaultValues={defaultLengthOfRetirementValues}>
      <SpendingPlanProvider defaultValues={defaultSpendingPlanValues}>
        <CalculatorModeContext>
          <App />
        </CalculatorModeContext>
      </SpendingPlanProvider>
    </LengthOfRetirementProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
