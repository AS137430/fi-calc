import React from 'react';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { WithdrawalPlanProvider } from './withdrawal-plan';
import { PortfolioProvider } from './portfolio';
import { UndoProvider } from './undo-history';
import { SimulationResultProvider } from './simulation-result';

export default function StateProviders({ children }) {
  return (
    <UndoProvider>
      <PortfolioProvider>
        <LengthOfRetirementProvider>
          <WithdrawalPlanProvider>
            <SimulationResultProvider>{children}</SimulationResultProvider>
          </WithdrawalPlanProvider>
        </LengthOfRetirementProvider>
      </PortfolioProvider>
    </UndoProvider>
  );
}
