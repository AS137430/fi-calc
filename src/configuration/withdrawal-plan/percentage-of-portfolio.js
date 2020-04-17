import React from 'react';
import Input from '../../common/input';
import WithdrawalLimits from './withdrawal-limits';

export default function PercentageOfPortfolioConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  return (
    <>
      <div className="formRow">
        <Input
          {...inputs.percentageOfPortfolio.getProps({
            id: 'percentageOfPortfolio',
            className: 'input-percent',
            type: 'number',
            min: 0,
            max: 100,
            step: 0.01,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('percentageOfPortfolio', newValue);
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
