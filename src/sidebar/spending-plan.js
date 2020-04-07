import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';

export default function SpendingPlan() {
  const { inputs, changeSelect, changeCheckbox, commitInput } = useForm({
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
          <span className="checkbox_label">Adjusted for Inflation</span>
        </label>
      </div>
    </SidebarPanel>
  );
}
