import React from 'react';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { SpendingPlanProvider } from './spending-plan';
import { PortfolioProvider } from './portfolio';
import { UndoProvider } from './undo-history';
import { SimulationResultProvider } from './simulation-result';

export default function StateProviders({ children }) {
  return (
    <UndoProvider>
      <PortfolioProvider>
        <LengthOfRetirementProvider>
          <SpendingPlanProvider>
            <SimulationResultProvider>{children}</SimulationResultProvider>
          </SpendingPlanProvider>
        </LengthOfRetirementProvider>
      </PortfolioProvider>
    </UndoProvider>
  );
}
