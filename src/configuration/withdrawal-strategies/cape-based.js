import React from 'react';
import WithdrawalLimits from './withdrawal-limits';
import Input from '../../common/input';

export default function CapeBasedConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  return (
    <>
      <div className="inputLabel_container">
        <label htmlFor="capeWithdrawalRate" className="inputLabel">
          Combine this base withdrawal rate:
        </label>
      </div>
      <div className="formRow">
        <Input
          {...inputs.capeWithdrawalRate.getProps({
            id: 'capeWithdrawalRate',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('capeWithdrawalRate', newValue);
            },
          })}
        />
      </div>
      <div className="inputLabel_container">
        <label htmlFor="capeWeight" className="inputLabel">
          with an amount determined by multiplying this value
        </label>
      </div>
      <div className="formRow">
        <Input
          {...inputs.capeWeight.getProps({
            id: 'capeWeight',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('capeWeight', newValue);
            },
          })}
        />
      </div>
      <div className="inputLabel_container">
        <div className="inputLabel">by the current year CAEY</div>
      </div>
      <WithdrawalLimits
        inputs={inputs}
        changeCheckbox={changeCheckbox}
        commitInput={commitInput}
      />
    </>
  );
}
