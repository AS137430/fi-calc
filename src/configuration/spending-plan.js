import React, { useState } from 'react';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import IconDone from 'materialish/icon-done';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';
import Modal from '../common/modal';

export default function SpendingPlan() {
  const {
    state: spendingPlan,
    inputs,
    changeSelect,
    changeCheckbox,
    commitInput,
  } = useForm({
    formConfig: spendingPlanForm,
    useSourceOfTruth: useSpendingPlan,
  });

  const [isInflationModalOpen, setIsInflationModalOpen] = useState(false);

  return (
    <>
      <ConfigSection title="Spending Plan">
        <div className="formRow">
          <select
            id="country"
            value={inputs.spendingStrategy.value}
            className="select"
            onChange={e => changeSelect('spendingStrategy', e)}>
            {spendingPlanForm.values.spendingStrategy.values.map(val => (
              <option key={val.key} value={val.key}>
                {val.display}
              </option>
            ))}
          </select>
        </div>
        {spendingPlan.spendingStrategy.key === 'constantSpending' && (
          <>
            <div className="formRow">
              <Input
                {...inputs.annualSpending.getProps({
                  id: 'annualSpending',
                  className: 'input-annualSpending',
                  type: 'number',
                  min: 0,
                  step: 1,
                  inputMode: 'numeric',
                  autoComplete: 'off',
                  prefix: '$',
                  suffix: 'per year',
                  onCommit(event, newValue) {
                    commitInput('annualSpending', newValue);
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
                onClick={() => setIsInflationModalOpen(true)}>
                <IconHelp />
              </button>
            </div>
          </>
        )}
        {spendingPlan.spendingStrategy.key === 'portfolioPercent' && (
          <>
            <div className="formRow">
              <Input
                {...inputs.percentageOfPortfolio.getProps({
                  id: 'percentageOfPortfolio',
                  className: 'input-percent',
                  type: 'number',
                  min: 0,
                  max: 1,
                  step: 0.01,
                  inputMode: 'numeric',
                  autoComplete: 'off',
                  suffix: '%',
                  onCommit(event, newValue) {
                    commitInput('percentageOfPortfolio', newValue);
                  },
                })}
              />
            </div>
            <div className="formRow">
              <label htmlFor="minWithdrawalLimit" className="inputLabel">
                Minimum Annual Spend
              </label>
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
                    inputMode: 'numeric',
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
              <label htmlFor="minWithdrawalLimit" className="inputLabel">
                Maximum Annual Spend
              </label>
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
                    inputMode: 'numeric',
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
          </>
        )}
        {spendingPlan.spendingStrategy.key === 'hebeler' && (
          <div className="formRow">
            <div className="formRow_message">
              The Hebeler Autopilot strategy is not currently supported.
            </div>
          </div>
        )}
        {spendingPlan.spendingStrategy.key === 'gk' && (
          <div className="formRow">
            <div className="formRow_message">
              The Guyton-Klinger strategy is not currently supported.
            </div>
          </div>
        )}
      </ConfigSection>
      <Modal
        active={isInflationModalOpen}
        onBeginClose={() => setIsInflationModalOpen(false)}>
        <Modal.Title>Adjusting for Inflation</Modal.Title>
        <div className="recommendation">
          <IconDone />
          <div>
            We recommend <b>enabling</b> this feature.
          </div>
        </div>
        <Modal.Body>
          <p>
            Adjusting for inflation ensures that your purchasing power – the
            amount of stuff that you can buy each year – stays about the same
            throughout your retirement.
          </p>
          <p>
            This is necessary because of the fact that things tend to become
            more expensive over time, so a single dollar buys you less. This is
            called <b>inflation</b>.
          </p>
          <p>
            From one year to the next, the effect of inflation isn't always
            noticeable, as it tends to be a small percentage, around 3%.
            However, over larger periods of time (like the duration of a typical
            retirement), this 3% adds up.
          </p>
          <p>
            For example, if you started with $10,000 in 1997 and waited 20
            years, that same $10,000 only had the purchasing power of $6,551.67
            in 2007.
          </p>
          <p>
            Disabling this feature increases success rates significantly, but
            the results are often misleading as this implicitly means that
            you're spending less money over time.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setIsInflationModalOpen(false)}>
            Dismiss
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
