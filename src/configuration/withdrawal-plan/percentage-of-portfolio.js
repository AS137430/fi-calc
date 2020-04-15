import React, { useState } from 'react';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import InfoModal from '../../common/info-modal';
import Input from '../../common/input';

export default function PercentageOfPortfolioConfiguration({
  inputs,
  changeCheckbox,
  commitInput,
}) {
  const [openModal, setOpenModal] = useState(null);

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
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="minWithdrawalLimit" className="inputLabel">
            Minimum Annual Withdrawal
          </label>
          <button
            title="Learn more"
            className="helpIcon"
            type="button"
            onClick={() => setOpenModal('minWithdrawalLimit')}>
            <IconHelp />
          </button>
        </div>
        <div className="formRow_checkboxInputContainer">
          <Checkbox
            className="checkbox"
            id="minWithdrawalLimitEnabled"
            checked={inputs.minWithdrawalLimitEnabled.value}
            onChange={event =>
              changeCheckbox('minWithdrawalLimitEnabled', event)
            }
          />
          <Input
            {...inputs.minWithdrawalLimit.getProps({
              id: 'minWithdrawalLimit',
              className: 'input-dollars',
              type: 'number',
              min: 0,
              inputMode: 'decimal',
              autoComplete: 'off',
              prefix: '$',
              disabled: !inputs.minWithdrawalLimitEnabled.value,
              onCommit(event, newValue) {
                commitInput('minWithdrawalLimit', newValue);
              },
            })}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="minWithdrawalLimit" className="inputLabel">
            Maximum Annual Withdrawal
          </label>
          <button
            title="Learn more"
            className="helpIcon"
            type="button"
            onClick={() => setOpenModal('maxWithdrawalLimit')}>
            <IconHelp />
          </button>
        </div>
        <div className="formRow_checkboxInputContainer">
          <Checkbox
            className="checkbox"
            id="maxWithdrawalLimitEnabled"
            checked={inputs.maxWithdrawalLimitEnabled.value}
            onChange={event =>
              changeCheckbox('maxWithdrawalLimitEnabled', event)
            }
          />
          <Input
            {...inputs.maxWithdrawalLimit.getProps({
              id: 'maxWithdrawalLimit',
              className: 'input-dollars',
              type: 'number',
              min: 0,
              inputMode: 'decimal',
              disabled: !inputs.maxWithdrawalLimitEnabled.value,
              autoComplete: 'off',
              prefix: '$',
              onCommit(event, newValue) {
                commitInput('maxWithdrawalLimit', newValue);
              },
            })}
          />
        </div>
      </div>
      <InfoModal
        recommendation="We recommend specifying a minimum withdrawal."
        title="Minimum Annual Withdrawal Limit"
        active={openModal === 'minWithdrawalLimit'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          A minimum withdrawal limit ensures that your withdrawal never drops
          below a certain amount. If you disable this feature, then your
          retirement plan will never fail, because even if you have $1 left,
          you'll still only be withdrawing a percentage of the $1, so your
          portfolio will never hit $0.
        </p>
        <p>
          Of course, living on a few cents per year is not sustainable.
          Accordingly, it is best to specify some kind of minimum withdrawal.
          What is the least you could live on during economic downturns? Think
          about it, and put that number here.
        </p>
        <p>
          Keep in mind that the minimum withdrawal is adjusted for inflation, so
          the purchasing power of the minimum withdrawal remains constant
          throughout your retirement.
        </p>
      </InfoModal>
      <InfoModal
        title="Maximum Annual Withdrawal Limit"
        active={openModal === 'maxWithdrawalLimit'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          A maximum withdrawal limit ensures that your withdrawal never
          increases beyond a certain amount, even when the economy is doing
          exceptionally well.
        </p>
        <p>
          You don't <i>need</i> to specify a maximum withdrawal for good success
          rates, although a maximum withdrawal limit does typically improve the
          rate of success.
        </p>
        <p>
          However, you may still prefer to specify a maximum withdrawal for
          psychological reasons. I believe it is more difficult to "deflate" a
          lifestyle than it is to "inflate" it.
        </p>
        <p>
          For example, if your typical withdrawal is $40,000 per year, you may
          one day find yourself able to withdraw $120,000 if you don't specify a
          maximum withdrawal limit. And you may even find things to spend this
          money on. However, a recession might bring the following withdrawal
          down to $35,000. Would you find it difficult to adjust to this sudden
          change?
        </p>
        <p>
          Specifying a maximum withdrawal limit ensures that your withdrawal
          does not fluctuate this much.
        </p>
        <p>
          The maximum withdrawal is inflation-adjusted, so its purchasing power
          remains constant throughout the retirement.
        </p>
      </InfoModal>
    </>
  );
}
