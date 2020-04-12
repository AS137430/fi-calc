import React from 'react';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

export default function LengthOfRetirementConfig() {
  const { inputs, commitInput } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });

  return (
    <ConfigSection title="Length of Retirement">
      <div className="formRow">
        <Input
          {...inputs.numberOfYears.getProps({
            id: 'numberOfYears',
            className: 'input-years',
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 300,
            step: 1,
            inputMode: 'numeric',
            autoComplete: 'off',
            suffix: 'years',
            onCommit(event, newValue) {
              commitInput('numberOfYears', newValue);
            },
          })}
        />
      </div>
    </ConfigSection>
  );
}
