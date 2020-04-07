import React from 'react';
import _ from 'lodash';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
import reactOnInputBlur from '../utils/forms/react-on-input-blur';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';

export default function SpendingPlan() {
  const {
    setState: setAnnualSpending,
    addReverseAction,
    inputs,
    updateFormValue,
    inputsRef,
    stateRef: spendingPlanRef,
    changeSelect,
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
      <div className="formRow">
        <ValueInput
          {...inputs.annualSpending.getProps({
            id: 'annualSpending',
            className: 'canvasSettings_width ',
            type: 'number',
            min: 0,
            step: 1,
            inputMode: 'numeric',
            autoComplete: 'off',
            unit: '$',
            suffix: false,
            onCommit(event, newValue) {
              const prevValidValue = spendingPlanRef.current.annualSpending;
              const numericNewValue = Number(newValue);

              // If the value has not changed, then we do not need to take any action
              if (numericNewValue === prevValidValue) {
                return;
              }

              reactOnInputBlur({
                id: 'annualSpending',
                prevValidValue,
                inputs: inputsRef.current,
                updateFormValue,
                onPersist() {
                  addReverseAction(() => {
                    updateFormValue('annualSpending', prevValidValue);

                    setAnnualSpending({
                      annualSpending: prevValidValue,
                    });
                  });

                  setAnnualSpending({
                    annualSpending: numericNewValue,
                  });
                },
              });
            },
          })}
        />
      </div>
    </SidebarPanel>
  );
}
