import React, { useState } from 'react';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import InfoModal from '../../common/info-modal';
// import Modal from '../../common/modal';
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
        <h2 className="formRow_title">Modified Withdrawal Rule</h2>{' '}
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('modifiedWithdrawalRule')}>
          <IconHelp />
        </button>
      </div>
      <div className="formRow formRow-flex">
        <Checkbox
          className="checkbox"
          id="gkModifiedWithdrawalRule"
          checked={inputs.gkModifiedWithdrawalRule.value}
          onChange={event => changeCheckbox('gkModifiedWithdrawalRule', event)}
        />
        <label htmlFor="gkModifiedWithdrawalRule" className="checkbox_label">
          Enable this rule
        </label>
      </div>
      <div className="formRow_separator" />
      <div className="formRow formRow-flex">
        <h2 className="formRow_title">Capital Preservation Rule</h2>{' '}
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('capitalPreservationRule')}>
          <IconHelp />
        </button>
      </div>
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
          onClick={() => setOpenModal('disableAfter15Years')}>
          <IconHelp />
        </button>
      </div>
      <div className="formRow_separator" />
      <div className="formRow formRow-flex">
        <h2 className="formRow_title">Properity Rule</h2>{' '}
        <button
          title="Learn more"
          className="helpIcon"
          type="button"
          onClick={() => setOpenModal('prosperityRule')}>
          <IconHelp />
        </button>
      </div>
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
      <InfoModal
        title="Initial Withdrawal"
        active={openModal === 'initialWithdrawal'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Similar to the Constant Spending plan, Guyton-Klinger requires that
          you specify an initial withdrawal amount, which is how much money you
          withdraw from your portfolio on your first year. This value forms the
          foundation for how much you withdraw each year throughout your
          retirement.
        </p>
        <p>
          For most, but not all, subsequent years, this value will be adjusted
          for inflation to ensure that your purchasing power remains about the
          same.
        </p>
        <p>
          In addition, this value may be adjusted either up or down based on how
          much money is left in your portfolio and how the overall market is
          performing.
        </p>
        <p>
          The specific details of how this value is adjusted is based on what
          Guyton-Klinger calls "Decision Rules." Please refer to the help dialog
          for the Guyton-Klinger withdrawal method to learn more about the
          Decision Rules.
        </p>
      </InfoModal>
      <InfoModal
        title="Modified Withdrawal Rule"
        active={openModal === 'modifiedWithdrawalRule'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          The <b>Modified Withdrawal Rule</b> is one of three Decision Rules
          specified by Guyton-Klinger that affect how your withdrawal amount is
          determined for each year.
        </p>
        <p>
          Typically, Guyton-Klinger's withdrawal plan involves adjusting your
          initial spending rate for inflation. However, the Modified Withdrawal
          Rules specifies how, for some years, inflation will be ignored.
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
          decreasing the amount that you withdraw when the market is performing
          poorly.
        </p>
        <p>
          Even when this rule applies, the other two rules may still further
          adjust your withdrawal for the year.
        </p>
        <p>
          This rule has a subtle effect on yearly withdrawals, so you should not
          expect huge changes in success rates if you disable it. Nevertheless,
          we recommend that you keep this Decision Rule enabled.
        </p>
      </InfoModal>
      <InfoModal
        title="Ignoring The Capital Preservation Rule When 15 Years Remain"
        active={openModal === 'disableAfter15Years'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Klinger recommends ignoring the Capital Preservation Rule when you're
          15 years from the estimated end of your retirement.
        </p>
        <p>
          The purpose of this Rule is to help protect you against running out of
          money. However, Klinger observed that success rates aren't
          significantly affected when this rule is ignored for the final 15
          years of a retirement.
        </p>
        <p>
          Feel free to disable this rule. However, keep in mind what it means in
          practice: at some point during your retirement, you must think, "I
          believe I am 15 years from the end of my life, so I will adjust my
          withdrawal strategy." It's a grim thought to have, so disabling this
          Rule may not be something that you feel comfortable doing for
          psychological reasons.
        </p>
        <p>
          It is also worth considering that the end of an actual retirement is
          hard to predict. Even if at some point you believe that you have 15 or
          fewer years left to live, you may in fact live for much longer.
        </p>
      </InfoModal>
      <InfoModal
        title="Capital Preservation Rule"
        active={openModal === 'capitalPreservationRule'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          The <b>Capital Preservation Rule</b> is one of three Decision Rules
          specified by Guyton-Klinger that affect how your withdrawal amount is
          determined for each year.
        </p>
        <p>
          The purpose of this rule is to cut back your annual withdrawal when
          your portfolio value drops too low.
        </p>
        <p>
          The rule is straightforward: any time that a year's withdrawal rate
          goes too high above the initial withdrawal rate, then it is cut back
          by some amount.
        </p>
        <p>
          By default, the threshold for when spending is cut is 20% above the
          initial withdrawal rate, and the size of the cut is 10%.
        </p>
        <p>
          To give an example, consider an initial withdrawal of $40,000 and an
          initial portfolio of $1,000,000. This is a 4% initial withdrawal rate.
        </p>
        <p>
          Using the default values, this means that any time that the withdrawal
          rate exceeds 4.8% of the current portfolio value (4.8% being +20% of
          4%), it will be cut by 10%.
        </p>
        <p>
          Consider a year where the value of the portfolio has decreased to
          $850,000, and the withdrawal amount is calculated to be $43,000. This
          would be a 5.05% withdrawal rate, which exceeds our threshold.
          Accordingly, the withdrawal amount is reduced by 10%, so you would
          withdraw $38,700.
        </p>
      </InfoModal>
      <InfoModal
        title="Prosperity Rule"
        active={openModal === 'prosperityRule'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          The <b>Prosperity Rule</b> is one of three Decision Rules specified by
          Guyton-Klinger that affect how your withdrawal amount is determined
          for each year.
        </p>
        <p>
          The purpose of this rule is to help ensure that your withdrawal never
          drops too low.
        </p>
        <p>
          The rule is very similar to the Capital Preservation Rule: any time
          that a year's withdrawal rate goes too far below the initial
          withdrawal rate, then it is increased by some amount.
        </p>
        <p>
          By default, the threshold for when spending is increased is 20% below
          the initial withdrawal rate, and the size of the increase is 10%.
        </p>
        <p>
          To give an example, consider an initial withdrawal of $40,000 and an
          initial portfolio of $1,000,000. This is a 4% initial withdrawal rate.
        </p>
        <p>
          Using the default values, this means that any time that the withdrawal
          rate exceeds 3.2% of the current portfolio value (3.2% being -20% of
          4%), it will be increased by 10%.
        </p>
        <p>
          Consider a year where the value of the portfolio has increased to
          $1,500,000, and the withdrawal amount is calculated to be $46,000.
          This would be a 3.06% withdrawal rate, which is below our threshold.
          Accordingly, the withdrawal amount is increased by 10%, so you would
          withdraw $50,600.
        </p>
      </InfoModal>
    </>
  );
}
