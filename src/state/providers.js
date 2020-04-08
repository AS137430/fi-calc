import React from 'react';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { SpendingPlanProvider } from './spending-plan';
import { PortfolioProvider } from './portfolio';
import { CalculatorModeContext } from './calculator-mode';

export default function StateProviders({ children }) {
  return (
    <PortfolioProvider>
      <LengthOfRetirementProvider>
        <SpendingPlanProvider>
          <CalculatorModeContext>{children}</CalculatorModeContext>
        </SpendingPlanProvider>
      </LengthOfRetirementProvider>
    </PortfolioProvider>
  );
}
