import React from 'react';
import { HistoricalDataRangeProvider } from './historical-data-range';
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
      <HistoricalDataRangeProvider>
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
      </HistoricalDataRangeProvider>
    </UndoProvider>
  );
}
