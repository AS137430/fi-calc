import React from 'react';
import { SimulationDataProvider } from './simulation-data';
import { LengthOfRetirementProvider } from './length-of-retirement';
import { WithdrawalPlanProvider } from './withdrawal-plan';
import { PortfolioProvider } from './portfolio';
import { UndoProvider } from './undo-history';
import { AdditionalWithdrawalsProvider } from './additional-withdrawals';
import { AdditionalIncomeProvider } from './additional-income';
import { SimulationResultProvider } from './simulation-result';

export default function StateProviders({ children }) {
  return (
    <UndoProvider>
      <SimulationDataProvider>
        <PortfolioProvider>
          <LengthOfRetirementProvider>
            <WithdrawalPlanProvider>
              <AdditionalIncomeProvider>
                <AdditionalWithdrawalsProvider>
                  <SimulationResultProvider>
                    {children}
                  </SimulationResultProvider>
                </AdditionalWithdrawalsProvider>
              </AdditionalIncomeProvider>
            </WithdrawalPlanProvider>
          </LengthOfRetirementProvider>
        </PortfolioProvider>
      </SimulationDataProvider>
    </UndoProvider>
  );
}
