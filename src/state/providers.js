import React from 'react';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { SpendingPlanProvider } from './spending-plan';
import { PortfolioProvider } from './portfolio';
import { UndoProvider } from './undo-history';

export default function StateProviders({ children }) {
  return (
    <UndoProvider>
      <PortfolioProvider>
        <LengthOfRetirementProvider>
          <SpendingPlanProvider>{children}</SpendingPlanProvider>
        </LengthOfRetirementProvider>
      </PortfolioProvider>
    </UndoProvider>
  );
}
