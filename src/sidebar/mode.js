import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import useCalculatorMode from '../state/calculator-mode';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

const modes = [
  {
    key: 'allHistory',
    display: 'Multiple simulations',
  },
  {
    key: 'specificYears',
    display: 'Single simulation',
  },
];

export default function Mode() {
  const [mode, setMode] = useCalculatorMode();
  const { inputs, commitInput } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });

  return (
    <SidebarPanel>
      <div className="formRow">
        <select
          id="country"
          value={mode}
          className="select"
          onChange={e => setMode(e.target.value)}>
          {modes.map(val => (
            <option key={val.key} value={val.key}>
              {val.display}
            </option>
          ))}
        </select>
      </div>
      {mode === 'allHistory' && (
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
      {mode === 'specificYears' && (
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
