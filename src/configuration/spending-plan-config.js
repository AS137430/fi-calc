import React, { useState } from 'react';
import _ from 'lodash';
import { Checkbox } from 'materialish';
import IconHelp from 'materialish/icon-help';
import IconDone from 'materialish/icon-done';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Modal from '../common/modal';
import Input from '../common/input';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';

export default function SpendingPlanConfig() {
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

  const [openModal, setOpenModal] = useState(null);

  const display = _.chain(spendingPlanForm.values.spendingStrategy.values)
    .find({
      key: inputs.spendingStrategy.value,
    })
    .get('display')
    .startCase()
    .value();

  return (
    <>
      <ConfigSection
        title="Withdrawal Plan"
        onHelpClick={() => setOpenModal('titleHelp')}>
        <div className="formRow formRow-flex">
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
          <button
            title="Learn more about this withdrawal strategy"
            className="helpIcon"
            type="button"
            onClick={() => setOpenModal('withdrawalStrategy')}>
            <IconHelp />
          </button>
        </div>
        <div className="formRow_separator" />
        {spendingPlan.spendingStrategy.key === 'constantSpending' && (
          <>
            <div className="formRow">
              <Input
                {...inputs.annualSpending.getProps({
                  id: 'annualSpending',
                  className: 'input-annualSpending',
                  type: 'number',
                  min: 0,
                  inputMode: 'decimal',
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
                onClick={() => setOpenModal('inflation')}>
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
          <>
            <div className="formRow">
              <div className="inputLabel_container">
                <label htmlFor="gkInitialSpending" className="inputLabel">
                  Initial Withdrawal
                </label>
                <button
                  title="Learn more"
                  className="helpIcon"
                  type="button"
                  onClick={() => setOpenModal('gkInitialSpending')}>
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
            <div className="formRow">
              <div className="inputLabel_container">
                <label htmlFor="gkWithdrawalUpperLimit" className="inputLabel">
                  When withdrawal exceeds
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
                  of initial withdrawal, then reduce it by
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
            <div className="formRow_separator" />
            <div className="formRow">
              <div className="inputLabel_container">
                <label htmlFor="gkWithdrawalLowerLimit" className="inputLabel">
                  When withdrawal is below
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
                  of initial withdrawal, then increase it by
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
            <div className="formRow formRow-flex">
              <Checkbox
                className="checkbox"
                id="gkIgnoreLastFifteenYears"
                checked={inputs.gkIgnoreLastFifteenYears.value}
                onChange={event =>
                  changeCheckbox('gkIgnoreLastFifteenYears', event)
                }
              />
              <label
                htmlFor="gkIgnoreLastFifteenYears"
                className="checkbox_label">
                Ignore the final 15 years
              </label>
              <button
                title="Learn more"
                className="helpIcon"
                type="button"
                onClick={() => setOpenModal('inflation')}>
                <IconHelp />
              </button>
            </div>
          </>
        )}
      </ConfigSection>
      <Modal
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Withdrawal Plan</Modal.Title>
        <Modal.Body>
          <p>
            Your <i>withdrawal plan</i> describes two things:
          </p>
          <ol>
            <li>
              How much money you intend to withdraw from your portfolio each
              year during retirement
            </li>
            <li>
              How you plan to adjust your withdrawals, if at all, in response to
              changes in the market
            </li>
          </ol>
          <p>
            The default plan, <b>constant withdrawal</b>, is the withdrawal plan
            used by the studies that derived the 4% rule.
          </p>
          <p>
            The 4% rule studies are foundational in retirement planning, and
            there are no doubt many retirees who are successfully using constant
            withdrawal as their withdrawal plan. However, some believe that it
            could be improved, which is why this calculator includes other
            withdrawal plans for you to explore.
          </p>
          <p>
            To learn more about each of the different withdrawal plans, first
            select the plan and then click the <IconHelp fill="white" /> icon
            next to the plan selection dropdown.
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
        active={openModal === 'inflation'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Adjust Spending for Inflation</Modal.Title>
        <div className="recommendation">
          <IconDone />
          <div>
            We recommend <b>enabling</b> this feature.
          </div>
        </div>
        <Modal.Body>
          <p>
            Adjusting your spending for inflation ensures that your purchasing
            power – the amount of stuff that you can buy each year – stays about
            the same throughout your retirement.
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
            onClick={() => setOpenModal(null)}>
            Okay
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        active={openModal === 'minWithdrawalLimit'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Minimum Withdrawal Limit</Modal.Title>
        <div className="recommendation">
          <IconDone />
          <div>We recommend specifying a minimum withdrawal.</div>
        </div>
        <Modal.Body>
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
            Keep in mind that the minimum withdrawal is adjusted for inflation,
            so the purchasing power of the minimum withdrawal remains constant
            throughout your retirement.
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
        active={openModal === 'maxWithdrawalLimit'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Maximum Withdrawal Limit</Modal.Title>
        <Modal.Body>
          <p>
            A maximum withdrawal limit ensures that your withdrawal never
            increases beyond a certain amount, even when the economy is doing
            exceptionally well.
          </p>
          <p>
            You don't <i>need</i> to specify a maximum withdrawal for good
            success rates, although a maximum withdrawal limit does typically
            improve the rate of success.
          </p>
          <p>
            However, you may still prefer to specify a maximum withdrawal for
            psychological reasons. I believe it is more difficult to "deflate" a
            lifestyle than it is to "inflate" it.
          </p>
          <p>
            For example, if your typical withdrawal is $40,000 per year, you may
            one day find yourself able to withdraw $120,000 if you don't specify
            a maximum withdrawal limit. And you may even find things to spend
            this money on. However, a recession might bring the following
            withdrawal down to $35,000. Would you find it difficult to adjust to
            this sudden change?
          </p>
          <p>
            Specifying a maximum withdrawal limit ensures that your spending
            does not fluctuate this much.
          </p>
          <p>
            The maximum withdrawal is inflation-adjusted, so its purchasing
            power remains constant throughout the retirement.
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
        active={openModal === 'withdrawalStrategy'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>
          Withdrawal Strategy
          {display && `: ${display}`}
        </Modal.Title>
        <Modal.Body>
          {inputs.spendingStrategy.value === 'constantSpending' && (
            <>
              <p>
                This is the withdrawal plan used in Bengen's original analysis,
                as well as the Trinity Study.
              </p>
              <p>
                It works like this: you choose some amount of your initial
                portfolio (such as 4% of the total value), and you spend that
                much the first year. For each subsequent year, you adjust your
                withdrawal to account for inflation, but you otherwise ignore
                how the market is doing, or what your portfolio is valued at.
              </p>
              <p>
                It's called "constant" because the purchasing power of your
                annual withdrawal remains constant.
              </p>
            </>
          )}
          {inputs.spendingStrategy.value === 'portfolioPercent' && (
            <>
              <p>
                In this strategy, your withdrawal limit is a percentage of the{' '}
                <i>current</i> value of your portfolio.
              </p>
              <p>
                This strategy is similar to the constant spending withdrawal
                plan, but it adjusts your annual withdrawal based on how the
                market is performing. When the market is doing poorly, you
                withdraw less, increasing your chance of success. And when the
                market is doing well, you are able to withdraw more.
              </p>
              <p>
                You may also set limits to specify the mimimum or maximum amount
                that you would like to withdraw each year. These limits are
                inflation adjusted, so the purchasing power of the limits
                remains constant throughout your retirement.
              </p>
            </>
          )}
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
