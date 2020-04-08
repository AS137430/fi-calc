import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';

export default function SpendingPlan() {
  const {
    state: spendingPlan,
    inputs,
    changeSelect,
    changeCheckbox,
    commitInput,
  } = useForm({
    formConfig: spendingPlanForm,
    useSourceOfTruth: useSpendingPlan,
  });

  return (
    <SidebarPanel title="Spending Plan">
      <div className="formRow">
        <select
          id="country"
          value={inputs.spendingStrategy.value}
          className="select"
          onChange={e => changeSelect('spendingStrategy', e)}>
          {spendingPlanForm.values.spendingStrategy.values.map(val => (
            <option key={val.key} value={val.key}>
              {val.display}
            </option>
          ))}
        </select>
      </div>
      {spendingPlan.spendingStrategy.key === 'constantSpending' && (
        <>
          <div className="formRow">
            <ValueInput
              {...inputs.annualSpending.getProps({
                id: 'annualSpending',
                type: 'number',
                min: 0,
                step: 1,
                inputMode: 'numeric',
                autoComplete: 'off',
                unit: '$',
                suffix: false,
                onCommit(event, newValue) {
                  commitInput('annualSpending', newValue);
                },
              })}
            />
          </div>
          <div className="formRow">
            <label className="checkbox_container">
              <Checkbox
                className="checkbox"
                checked={inputs.inflationAdjustedFirstYearWithdrawal.value}
                onChange={event =>
                  changeCheckbox('inflationAdjustedFirstYearWithdrawal', event)
                }
              />
              <span className="checkbox_label">Adjust for Inflation</span>
            </label>
          </div>
        </>
      )}
      {spendingPlan.spendingStrategy.key === 'portfolioPercent' && (
        <>
          <div className="formRow">
            <ValueInput
              {...inputs.percentageOfPortfolio.getProps({
                id: 'percentageOfPortfolio',
                type: 'number',
                min: 0,
                max: 1,
                step: 0.01,
                inputMode: 'numeric',
                autoComplete: 'off',
                unit: '%',
                onCommit(event, newValue) {
                  commitInput('percentageOfPortfolio', newValue);
                },
              })}
            />
          </div>
          <div className="formRow formRow-flex">
            <ValueInput
              {...inputs.minWithdrawalLimit.getProps({
                id: 'minWithdrawalLimit',
                type: 'number',
                min: 0,
                inputMode: 'numeric',
                autoComplete: 'off',
                unit: '$',
                suffix: false,
                onCommit(event, newValue) {
                  commitInput('minWithdrawalLimit', newValue);
                },
              })}
            />
            <ValueInput
              {...inputs.maxWithdrawalLimit.getProps({
                id: 'maxWithdrawalLimit',
                type: 'number',
                min: 0,
                inputMode: 'numeric',
                autoComplete: 'off',
                unit: '$',
                suffix: false,
                onCommit(event, newValue) {
                  commitInput('maxWithdrawalLimit', newValue);
                },
              })}
            />
          </div>
        </>
      )}
      {spendingPlan.spendingStrategy.key === 'hebeler' && (
        <div className="formRow">
          The Hebeler Autopilot strategy is not currently supported, but it will
          be soon.
        </div>
      )}
    </SidebarPanel>
  );
}
