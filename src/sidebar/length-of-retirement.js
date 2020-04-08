import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
import useCalculatorMode from '../state/calculator-mode';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

export default function LengthOfRetirement() {
  const [calculatorMode] = useCalculatorMode();
  const { inputs, commitInput } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });

  return (
    <SidebarPanel title="Length of Retirement">
      {calculatorMode === 'allHistory' && (
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
      )}
      {calculatorMode === 'specificYears' && (
        <>
          <div className="formRow">
            <ValueInput
              {...inputs.startYear.getProps({
                id: 'startYear',
                type: 'number',
                pattern: '\\d*',
                inputMode: 'numeric',
                autoComplete: 'off',
                onCommit(event, newValue) {
                  commitInput('startYear', newValue);
                },
              })}
            />
          </div>
          <div className="formRow">
            <ValueInput
              {...inputs.endYear.getProps({
                id: 'endYear',
                type: 'number',
                pattern: '\\d*',
                inputMode: 'numeric',
                autoComplete: 'off',
                onCommit(event, newValue) {
                  commitInput('endYear', newValue);
                },
              })}
            />
          </div>
        </>
      )}
    </SidebarPanel>
  );
}
