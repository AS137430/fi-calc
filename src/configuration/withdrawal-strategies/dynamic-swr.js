import React from 'react';
import Input from '../../common/input';
import WithdrawalLimits from './withdrawal-limits';

export default function DynamicSwrConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  return (
    <>
      <div className="formRow_separator" />
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="dynamicSwrRoiAssumption" className="inputLabel">
            ROI Assumption
          </label>
          <button title="Learn more" className="helpIcon" type="button" />
        </div>
        <Input
          {...inputs.dynamicSwrRoiAssumption.getProps({
            id: 'dynamicSwrRoiAssumption',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('dynamicSwrRoiAssumption', newValue);
            },
          })}
        />
      </div>

      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="dynamicSwrInflationAssumption" className="inputLabel">
            Inflation Assumption
          </label>
          <button title="Learn more" className="helpIcon" type="button" />
        </div>
        <Input
          {...inputs.dynamicSwrInflationAssumption.getProps({
            id: 'dynamicSwrInflationAssumption',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('dynamicSwrInflationAssumption', newValue);
            },
          })}
        />
      </div>

      <WithdrawalLimits
        inputs={inputs}
        changeCheckbox={changeCheckbox}
        commitInput={commitInput}
      />
    </>
  );
}
