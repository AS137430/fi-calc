import React, { useState } from 'react';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import InfoModal from '../../common/info-modal';
import Input from '../../common/input';

export default function CapeBasedConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <div className="inputLabel_container">
        <label htmlFor="capeWithdrawalRate" className="inputLabel">
          Combine this base withdrawal rate:
        </label>
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('capeWithdrawalRate')}>
          <IconHelp />
        </button>
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
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('capeWeight')}>
          <IconHelp />
        </button>
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
    </>
  );
}
