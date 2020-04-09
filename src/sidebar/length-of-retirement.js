import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import Input from '../common/input';
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
    <SidebarPanel>
      {calculatorMode === 'allHistory' && (
        <div className="formRow">
          <label htmlFor="numberOfYears" className="inputLabel">
            Length of Retirement
          </label>
          <Input
            {...inputs.numberOfYears.getProps({
              id: 'numberOfYears',
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
      )}
      {calculatorMode === 'specificYears' && (
        <>
          <div className="formRow">
            <div className="valueInput_pairContainer">
              <div className="valueInput_inputContainer">
                <label htmlFor="startYear" className="inputLabel">
                  Start Year
                </label>
                <Input
                  {...inputs.startYear.getProps({
                    id: 'startYear',
                    className: 'input-year',
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
              <div className="valueInput_inputContainer">
                <label htmlFor="endYear" className="inputLabel">
                  End Year
                </label>
                <Input
                  {...inputs.endYear.getProps({
                    id: 'endYear',
                    className: 'input-year',
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
            </div>
          </div>
        </>
      )}
    </SidebarPanel>
  );
}
