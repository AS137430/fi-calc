import React, { useState } from 'react';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import Modal from '../../common/modal';
import Input from '../../common/input';

export default function GuytonKlingerConfiguration({
  spendingPlan,
  inputs,
  changeSelect,
  changeCheckbox,
  commitInput,
}) {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <div className="formRow_separator" />
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="gkInitialSpending" className="inputLabel">
            Initial Withdrawal
          </label>
          <button
            title="Learn more"
            className="helpIcon"
            type="button"
            onClick={() => setOpenModal('initialWithdrawal')}>
            <IconHelp />
          </button>
        </div>
        <Input
          {...inputs.gkInitialSpending.getProps({
            id: 'gkInitialSpending',
            className: 'input-annualSpending',
            type: 'number',
            min: 0,
            inputMode: 'decimal',
            autoComplete: 'off',
            prefix: '$',
            suffix: 'per year',
            onCommit(event, newValue) {
              commitInput('gkInitialSpending', newValue);
            },
          })}
        />
      </div>
      <div className="formRow_separator" />
      <div className="formRow formRow-flex">
        <Checkbox
          className="checkbox"
          id="gkModifiedWithdrawalRule"
          checked={inputs.gkModifiedWithdrawalRule.value}
          onChange={event => changeCheckbox('gkModifiedWithdrawalRule', event)}
        />
        <label htmlFor="gkModifiedWithdrawalRule" className="checkbox_label">
          Modified Withdrawal Rule
        </label>
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('modifiedWithdrawalRule')}>
          <IconHelp />
        </button>
      </div>
      <div className="formRow_separator" />
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="gkWithdrawalUpperLimit" className="inputLabel">
            When withdrawal rate exceeds
          </label>
        </div>
        <Input
          {...inputs.gkWithdrawalUpperLimit.getProps({
            id: 'gkWithdrawalUpperLimit',
            className: 'input-annualSpending',
            type: 'number',
            min: 0,
            max: 100,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('gkWithdrawalUpperLimit', newValue);
            },
          })}
        />
      </div>
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="gkUpperLimitAdjustment" className="inputLabel">
            of initial withdrawal rate, then reduce it by
          </label>
        </div>
        <Input
          {...inputs.gkUpperLimitAdjustment.getProps({
            id: 'gkUpperLimitAdjustment',
            className: 'input-annualSpending',
            type: 'number',
            min: 0,
            max: 100,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('gkUpperLimitAdjustment', newValue);
            },
          })}
        />
      </div>
      <div className="formRow formRow-flex">
        <Checkbox
          className="checkbox"
          id="gkIgnoreLastFifteenYears"
          checked={inputs.gkIgnoreLastFifteenYears.value}
          onChange={event => changeCheckbox('gkIgnoreLastFifteenYears', event)}
        />
        <label htmlFor="gkIgnoreLastFifteenYears" className="checkbox_label">
          Ignore for the final 15 years
        </label>
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('inflation')}>
          <IconHelp />
        </button>
      </div>
      <div className="formRow_separator" />
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="gkWithdrawalLowerLimit" className="inputLabel">
            When withdrawal rate is below
          </label>
        </div>
        <Input
          {...inputs.gkWithdrawalLowerLimit.getProps({
            id: 'gkWithdrawalLowerLimit',
            className: 'input-annualSpending',
            type: 'number',
            min: 0,
            max: 100,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('gkWithdrawalLowerLimit', newValue);
            },
          })}
        />
      </div>
      <div className="formRow">
        <div className="inputLabel_container">
          <label htmlFor="gkLowerLimitAdjustment" className="inputLabel">
            of initial withdrawal rate, then increase it by
          </label>
        </div>
        <Input
          {...inputs.gkLowerLimitAdjustment.getProps({
            id: 'gkLowerLimitAdjustment',
            className: 'input-annualSpending',
            type: 'number',
            min: 0,
            max: 100,
            inputMode: 'decimal',
            autoComplete: 'off',
            suffix: '%',
            onCommit(event, newValue) {
              commitInput('gkLowerLimitAdjustment', newValue);
            },
          })}
        />
      </div>
      <div className="formRow_separator" />
      <Modal
        active={openModal === 'initialWithdrawal'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Initial Withdrawal</Modal.Title>
        <Modal.Body>
          <p>
            Similar to the Constant Spending plan, Guyton-Klinger requires that
            you specify an initial withdrawal amount, which is how much money
            you withdraw from your portfolio on your first year. This value
            forms the foundation for how much you withdraw each year throughout
            your retirement.
          </p>
          <p>
            For most, but not all, subsequent years, this value will be adjusted
            for inflation to ensure that your purchasing power remains about the
            same.
          </p>
          <p>
            In addition, this value may be adjusted either up or down based on
            how much money is left in your portfolio and how the overall market
            is performing.
          </p>
          <p>
            The specific details of how this value is adjusted is based on what
            Guyton-Klinger calls "Decision Rules." Please refer to the help
            dialog for the Guyton-Klinger withdrawal method to learn more about
            the Decision Rules.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setOpenModal(null)}>
            Okay
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        active={openModal === 'modifiedWithdrawalRule'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Modified Withdrawal Rule</Modal.Title>
        <Modal.Body>
          <p>
            The Modified Withdrawal Rule is one of three "Decision Rules"
            specified by Guyton-Klinger that affect how your withdrawal amount
            is determined for each year.
          </p>
          <p>
            Typically, Guyton-Klinger's withdrawal plan involves adjusting your
            initial spending rate for inflation. However, the Modified
            Withdrawal Rules specifies how, for some years, inflation will be
            ignored.
          </p>
          <p>Three conditions must be met for this rule to apply:</p>
          <ol>
            <li>
              The overall returns from your portfolio are negative for the year
            </li>
            <li>
              Inflation would increase the amount of money that you withdraw
            </li>
            <li>
              The year's withdrawal rate is greater than the initial withdrawal
              rate
            </li>
          </ol>
          <p>
            The purpose of this rule is to help preserve your portfolio by
            decreasing the amount that you withdraw when the market is
            performing poorly.
          </p>
          <p>
            Even when this rule applies, the other two rules may still further
            adjust your withdrawal for the year.
          </p>
          <p>
            This rule has a subtle effect on yearly withdrawals, so you should
            not expect huge changes in success rates when it is disabled.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setOpenModal(null)}>
            Okay
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
