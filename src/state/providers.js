import React from 'react';
import { HistoricalDataProvider } from './historical-data';
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
      <HistoricalDataProvider>
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
      </HistoricalDataProvider>
    </UndoProvider>
  );
}
