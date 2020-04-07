import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

export default function LengthOfRetirement() {
  const { inputs, commitInput } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });

  return (
    <SidebarPanel title="Length of Retirement">
      <div className="formRow">
        <ValueInput
          {...inputs.numberOfYears.getProps({
            id: 'numberOfYears',
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 300,
            step: 1,
            inputMode: 'numeric',
            autoComplete: 'off',
            unit: 'years',
            onCommit(event, newValue) {
              commitInput('numberOfYears', newValue);
            },
          })}
        />
      </div>
    </SidebarPanel>
  );
}
