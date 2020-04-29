import React, { useState } from 'react';
import _ from 'lodash';
import IconHelp from 'materialish/icon-help';
import ConfigSection from './sidebar-section';
import ConstantWithdrawal from './withdrawal-strategies/constant-withdrawal';
import PercentageOfPortfolio from './withdrawal-strategies/percentage-of-portfolio';
import GuytonKlinger from './withdrawal-strategies/guyton-klinger';
import NinetyFivePercentRule from './withdrawal-strategies/95-percent-rule';
import CapeBased from './withdrawal-strategies/cape-based';
import DynamicSwr from './withdrawal-strategies/dynamic-swr';
import useForm from '../hooks/use-form';
import InfoModal from '../common/info-modal';
import useWithdrawalStrategy from '../state/withdrawal-strategy';
import withdrawalStrategyFormConfig from '../form-config/withdrawal-strategy-form-config';

export default function WithdrawalStrategyForm() {
  const {
    state: withdrawalStrategy,
    inputs,
    changeSelect,
    changeCheckbox,
    commitInput,
  } = useForm({
    formConfig: withdrawalStrategyFormConfig,
    useSourceOfTruth: useWithdrawalStrategy,
  });

  const [openModal, setOpenModal] = useState(null);

  const display = _.chain(
    withdrawalStrategyFormConfig.values.withdrawalStrategyName.values
  )
    .find({
      key: inputs.withdrawalStrategyName.value,
    })
    .get('display')
    .value();

  return (
    <>
      <ConfigSection
        initialIsOpen
        title="Withdrawal Strategy"
        onHelpClick={() => setOpenModal('titleHelp')}>
        <ConfigSection.Contents>
          <div className="formRow formRow-flex">
            <select
              id="country"
              value={inputs.withdrawalStrategyName.value}
              className="select"
              onChange={e => changeSelect('withdrawalStrategyName', e)}>
              {withdrawalStrategyFormConfig.values.withdrawalStrategyName.values.map(
                val => (
                  <option key={val.key} value={val.key}>
                    {val.display}
                  </option>
                )
              )}
            </select>
            <button
              title="Learn more about this withdrawal strategy"
              className="helpIcon"
              type="button"
              onClick={() => setOpenModal('withdrawalStrategy')}>
              <IconHelp />
            </button>
          </div>
          {withdrawalStrategy.withdrawalStrategyName.key ===
            'constantWithdrawal' && (
            <ConstantWithdrawal
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
          {withdrawalStrategy.withdrawalStrategyName.key ===
            'portfolioPercent' && (
            <PercentageOfPortfolio
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
          {withdrawalStrategy.withdrawalStrategyName.key === 'hebeler' && (
            <div className="formRow">
              <div className="formRow_message">
                The Hebeler Autopilot strategy is not currently supported.
              </div>
            </div>
          )}
          {withdrawalStrategy.withdrawalStrategyName.key === 'gk' && (
            <GuytonKlinger
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
          {withdrawalStrategy.withdrawalStrategyName.key === '95percent' && (
            <NinetyFivePercentRule
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
          {withdrawalStrategy.withdrawalStrategyName.key === 'capeBased' && (
            <CapeBased
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
          {withdrawalStrategy.withdrawalStrategyName.key === 'dynamicSwr' && (
            <DynamicSwr
              inputs={inputs}
              changeCheckbox={changeCheckbox}
              commitInput={commitInput}
            />
          )}
        </ConfigSection.Contents>
      </ConfigSection>
      <InfoModal
        title="Withdrawal Strategy"
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          Your <i>withdrawal strategy</i> describes two things:
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
          The default strategy, <b>Constant Withdrawal</b>, is the withdrawal
          strategy used by the studies that derived the 4% rule.
        </p>
        <p>
          The 4% rule studies are foundational in retirement planning, and there
          are no doubt many retirees who are successfully using constant
          withdrawal as their withdrawal strategy. However, it is not the only
          withdrawal strategy out there, which is why this calculator includes
          other strategies for you to explore.
        </p>
        <p>
          Each withdrawal strategy has its pros and cons, and the authors of
          this calculator know of no strategy that is considered by the
          community to be "the best." We hope this calculator helps you find the
          strategy that feels right for your retirement plans.
        </p>
        <p>
          To learn more about each of the different withdrawal strategies, first
          choose the strategy in the dropdown, then click the <IconHelp /> icon
          next to its name.
        </p>
      </InfoModal>
      <InfoModal
        title={`Withdrawal Strategy${display && `: ${display}`}`}
        active={openModal === 'withdrawalStrategy'}
        onBeginClose={() => setOpenModal(null)}>
        {inputs.withdrawalStrategyName.value === 'constantWithdrawal' && (
          <>
            <p>
              This is the withdrawal strategy used in Bengen's original
              analysis, as well as the Trinity Study.
            </p>
            <p>
              It works like this: you choose some amount of your initial
              portfolio (such as 4% of the total value), and you withdraw that
              much the first year. For each subsequent year, you adjust your
              withdrawal to account for inflation, but you otherwise ignore how
              the market is doing, or what your portfolio is valued at.
            </p>
            <p>
              It's called "constant" because the purchasing power of your annual
              withdrawal remains constant.
            </p>
          </>
        )}
        {inputs.withdrawalStrategyName.value === 'portfolioPercent' && (
          <>
            <p>
              In this strategy, your withdrawal limit is a percentage of the{' '}
              <i>current</i> value of your portfolio.
            </p>
            <p>
              This strategy is similar to the Constant Withdrawal strategy, but
              it adjusts your annual withdrawal based on how the market is
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
        {inputs.withdrawalStrategyName.value === 'gk' && (
          <>
            <p>
              Guyton-Klinger is a withdrawal strategy that stands out for its
              exceptional success rates. You can think of it as a modified
              Constant Withdrawal strategy.
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
              complicated withdrawal strategy. If you are new to it, we
              encourage you to read about each of the Decision Rules by clicking
              on the <IconHelp /> icon next to each Decision Rule name.
            </p>
          </>
        )}
        {inputs.withdrawalStrategyName.value === '95percent' && (
          <>
            <p>
              The 95% Rule is a withdrawal strategy with a unique priority: it
              aims to preserve your initial portfolio value for the entire
              duration of your retirement. Other withdrawal strategies typically
              only care about having a nonzero amount of money remaining at the
              end of the estimated retirement.
            </p>
            <p>
              Using the 95% Rule, your annual withdrawals are based off of
              percentages, and as a result this strategy will <i>never</i>{' '}
              completely exhaust your portfolio. Unlike the Percent of Portfolio
              strategy, however, it avoids extreme year-over-year fluctuations
              that can result from withdrawing a direct percent of your current
              portfolio value.
            </p>
            <p>
              It does this through its namesake rule: the 95% Rule. The 95% Rule
              works like this: each year you can either withdraw your Safe
              Withdrawal Rate (typically around 4%) <em>or</em> 95% of your
              previous year's withdrawal.
            </p>
            <p>
              What this means is that your spending will only ever drop at most
              95% from the previous year, even if the market experiences a
              sudden and sharp decline. This can smooth out particularly
              turbulent retirement periods, such as the 30 year retirement from
              1930 to 1959.
            </p>
            <p>
              Keep in mind that although year-over-year withdrawal fluctuations
              are reduced with the 95% Rule, there can still be substantial
              fluctuations in withdrawals over the course of the entire
              retirement. Looking again at the 1930 to 1959 simulation: with an
              initial 4% withdrawal of $40,000, the smallest withdrawal is
              $20,083.01 while the largest is $62,849.28.
            </p>
          </>
        )}
        {inputs.withdrawalStrategyName.value === 'capeBased' && (
          <>
            <p>
              The CAPE-based withdrawal strategy is a modified version of the
              Percent of Portfolio withdrawal strategy. It avoids extreme
              year-to-year fluctuations in withdrawal rates by incorporating the
              CAPE into the yearly withdrawal. The CAPE is a value that is
              correlated with expected future earnings.
            </p>
            <p>
              The equation for the CAPE-based withdrawal method is as follows:
            </p>
            <code>(a + b * CAEY) * P</code>
            <p>
              Where <code>a</code> is the base withdrawal base, <code>b</code>{' '}
              is a weight of how much to factor in the CAPE, <code>CAEY</code>{' '}
              is equal to <code>1/CAPE</code>, and <code>P</code> is the
              current-year portfolio value.
            </p>
          </>
        )}
        {inputs.withdrawalStrategyName.value === 'dynamicSwr' && (
          <>
            <p>
              Dynamic SWR is a dynamic withdrawal strategy which continously 
              annuitizes your retirement savings. Your retirement income in a 
              given year is determined by the remaining balance of your retirement
              savings, life expectancy, and market expectations. As your life 
              expectancy wanes, the withdrawal rate increases such that not much
              is left behind.
            </p>
            <p>
              The equation for the Dynamic SWR withdrawal method is as follows:
            </p>
            <code>
              withdrawalAmount = 
              portfolioTotalValue * (roiAssumption - inflationAssumption) /
              (1 - Math.pow((1 + inflationAssumption) / (1 + roiAssumption), yearsRemaining + 1));
            </code>
            <p>
              Their official <a href="https://www.nesteggly.com/dynamic-safe-withdrawal-rate-calculator">calculator</a> can
              factor in pensions and social security to provide a more smooth income stream throughout retirement.
            </p>
            <p>
              Read more about Dynamic SWR <a href="https://www.nesteggly.com/blog/dynamic-swr-explained">here</a>.
            </p>
          </>
        )}
      </InfoModal>
    </>
  );
}
