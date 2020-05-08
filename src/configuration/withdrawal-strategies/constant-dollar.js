import React, { useState } from 'react';
import IconHelp from 'materialish/icon-help';
import Checkbox from '../../common/checkbox';
import InfoModal from '../../common/info-modal';
import Input from '../../common/input';

export default function ConstantDollarConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <div className="formRow">
        <Input
          {...inputs.annualWithdrawal.getProps({
            id: 'annualWithdrawal',
            className: 'input-annualWithdrawal',
            type: 'number',
            min: 0,
            inputMode: 'decimal',
            autoComplete: 'off',
            prefix: '$',
            suffix: 'per year',
            onCommit(event, newValue) {
              commitInput('annualWithdrawal', newValue);
            },
          })}
        />
      </div>
      <div className="formRow formRow-flex">
        <Checkbox
          className="checkbox"
          id="inflationAdjustedFirstYearWithdrawal"
          checked={inputs.inflationAdjustedFirstYearWithdrawal.value}
          onChange={event =>
            changeCheckbox('inflationAdjustedFirstYearWithdrawal', event)
          }
        />
        <label
          htmlFor="inflationAdjustedFirstYearWithdrawal"
          className="checkbox_label">
          Adjust for inflation
        </label>
        <button
          title="Learn more about inflation"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('inflation')}>
          <IconHelp />
        </button>
      </div>
      <InfoModal
        title="Adjust Withdrawal for Inflation"
        active={openModal === 'inflation'}
        recommendation
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Adjusting your withdrawal for inflation ensures that your purchasing
          power – the amount of stuff that you can buy each year – stays about
          the same throughout your retirement.
        </p>
        <p>
          This is necessary because of the fact that things tend to become more
          expensive over time, so a single dollar buys you less. This is called{' '}
          <b>inflation</b>.
        </p>
        <p>
          From one year to the next, the effect of inflation isn't always
          noticeable, as it tends to be a small percentage, around 3%. However,
          over larger periods of time (like the duration of a typical
          retirement), this 3% adds up.
        </p>
        <p>
          For example, if you started with $10,000 in 1997 and waited 20 years,
          that same $10,000 only had the purchasing power of $6,551.67 in 2007.
        </p>
        <p>
          Disabling this feature increases success rates significantly, but the
          results are often misleading as this implicitly means that you're
          withdrawing less money over time.
        </p>
      </InfoModal>
    </>
  );
}
