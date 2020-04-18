import React from 'react';
import { SimulationDataProvider } from './simulation-data';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { WithdrawalPlanProvider } from './withdrawal-plan';
import { PortfolioProvider } from './portfolio';
import { UndoProvider } from './undo-history';
import { SimulationResultProvider } from './simulation-result';

export default function StateProviders({ children }) {
  return (
    <UndoProvider>
      <SimulationDataProvider>
        <PortfolioProvider>
          <LengthOfRetirementProvider>
            <WithdrawalPlanProvider>
              <SimulationResultProvider>{children}</SimulationResultProvider>
            </WithdrawalPlanProvider>
          </LengthOfRetirementProvider>
        </PortfolioProvider>
      </SimulationDataProvider>
    </UndoProvider>
  );
}
