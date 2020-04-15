import React, { useState } from 'react';
import _ from 'lodash';
import IconHelp from 'materialish/icon-help';
import ConfigSection from './config-section';
import ConstantWithdrawal from './spending-plan/constant-withdrawal';
import PercentageOfPortfolio from './spending-plan/percentage-of-portfolio';
import GuytonKlinger from './spending-plan/guyton-klinger';
import useForm from '../hooks/use-form';
import InfoModal from '../common/info-modal';
import useSpendingPlan from '../state/spending-plan';
import spendingPlanForm from '../form-config/spending-plan-form';

export default function WithdrawalPlanConfig() {
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
        {spendingPlan.spendingStrategy.key === 'constantSpending' && (
          <ConstantWithdrawal
            inputs={inputs}
            changeCheckbox={changeCheckbox}
            commitInput={commitInput}
          />
        )}
        {spendingPlan.spendingStrategy.key === 'portfolioPercent' && (
          <PercentageOfPortfolio
            inputs={inputs}
            changeCheckbox={changeCheckbox}
            commitInput={commitInput}
          />
        )}
        {spendingPlan.spendingStrategy.key === 'hebeler' && (
          <div className="formRow">
            <div className="formRow_message">
              The Hebeler Autopilot strategy is not currently supported.
            </div>
          </div>
        )}
        {spendingPlan.spendingStrategy.key === 'gk' && (
          <GuytonKlinger
            inputs={inputs}
            changeCheckbox={changeCheckbox}
            commitInput={commitInput}
          />
        )}
      </ConfigSection>
      <InfoModal
        title="Withdrawal Plan"
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Your <i>withdrawal plan</i> describes two things:
        </p>
        <ol>
          <li>
            How much money you intend to withdraw from your portfolio each year
            during retirement
          </li>
          <li>
            How you plan to adjust your withdrawals, if at all, in response to
            changes in the market, how much money remains in your portfolio, or
            other variables
          </li>
        </ol>
        <p>
          The default plan, <b>Constant Withdrawal</b>, is the withdrawal plan
          used by the studies that derived the 4% rule.
        </p>
        <p>
          The 4% rule studies are foundational in retirement planning, and there
          are no doubt many retirees who are successfully using constant
          withdrawal as their withdrawal plan. However, it is not the only
          withdrawal plan out there, which is why this calculator includes other
          plans for you to explore.
        </p>
        <p>
          Each withdrawal plan has its pros and cons, and the authors of this
          calculator know of no plan that is considered by the community to be
          "the best." We hope this calculator helps you find the plan that feels
          right for your retirement plans.
        </p>
        <p>
          To learn more about each of the different withdrawal plans, first
          choose the plan in the dropdown, then click the <IconHelp /> icon next
          to its name.
        </p>
      </InfoModal>
      <InfoModal
        title={`Withdrawal Strategy${display && `: ${display}`}`}
        active={openModal === 'withdrawalStrategy'}
        onBeginClose={() => setOpenModal(null)}>
        {inputs.spendingStrategy.value === 'constantSpending' && (
          <>
            <p>
              This is the withdrawal plan used in Bengen's original analysis, as
              well as the Trinity Study.
            </p>
            <p>
              It works like this: you choose some amount of your initial
              portfolio (such as 4% of the total value), and you spend that much
              the first year. For each subsequent year, you adjust your
              withdrawal to account for inflation, but you otherwise ignore how
              the market is doing, or what your portfolio is valued at.
            </p>
            <p>
              It's called "constant" because the purchasing power of your annual
              withdrawal remains constant.
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
              This strategy is similar to the constant spending withdrawal plan,
              but it adjusts your annual withdrawal based on how the market is
              performing. When the market is doing poorly, you withdraw less,
              increasing your chance of success. And when the market is doing
              well, you are able to withdraw more.
            </p>
            <p>
              You may also set limits to specify the mimimum or maximum amount
              that you would like to withdraw each year. These limits are
              inflation adjusted, so the purchasing power of the limits remains
              constant throughout your retirement.
            </p>
          </>
        )}
        {inputs.spendingStrategy.value === 'gk' && (
          <>
            <p>
              Guyton-Klinger is a withdrawal plan that stands out for its
              exceptional success rates. You can think of it as a modified
              Constant Withdrawal plan.
            </p>
            <p>
              What makes Guyton-Klinger different from Constant Withdrawal are
              what are called the three Decision Rules. These rules adjust how
              much you withdraw each year based on how the market is performing,
              and how much money remains in your portfolio.
            </p>
            <p>
              One of the rules determines whether or not you should adjust your
              withdrawal rate for inflation in a given year. The other two rules
              increase or decrease your withdrawal based on the health of your
              portfolio.
            </p>
            <p>
              Because of these Decision Rules, Guyton-Klinger is a more
              complicated withdrawal plan. If you are new to it, we encourage
              you to read about each of the Decision Rules by clicking on the{' '}
              <IconHelp /> icon next to each Decision Rule name.
            </p>
          </>
        )}
      </InfoModal>
    </>
  );
}
