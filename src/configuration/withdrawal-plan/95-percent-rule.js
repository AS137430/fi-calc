import React from 'react';
import Input from '../../common/input';

export default function NinetyFivePercentRuleConfiguration({
  inputs,
  commitInput,
}) {
  return (
    <>
      <div className="inputLabel_container">
        <div className="inputLabel">Each year, withdraw</div>
      </div>
      <div className="formRow">
        <Input
          {...inputs.ninetyFiveInitialRate.getProps({
            id: 'ninetyFiveInitialRate',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('ninetyFiveInitialRate', newValue);
            },
          })}
        />
      </div>
      <div className="inputLabel_container">
        <div className="inputLabel">of current portfolio value, or</div>
      </div>
      <div className="formRow">
        <Input
          {...inputs.ninetyFivePercentage.getProps({
            id: 'ninetyFivePercentage',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('ninetyFivePercentage', newValue);
            },
          })}
        />
      </div>
      <div className="inputLabel_container">
        <div className="inputLabel">
          of previous year's withdrawal, whichever is greater
        </div>
      </div>
    </>
  );
}
