import React, { useState } from 'react';
import IconHelp from 'materialish/icon-help';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Modal from '../common/modal';
import Input from '../common/input';
import usePortfolio from '../state/portfolio';
import porfolioForm from '../form-config/portfolio-form';

export default function PortfolioConfig() {
  const { inputs, commitInput } = useForm({
    formConfig: porfolioForm,
    useSourceOfTruth: usePortfolio,
  });

  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <ConfigSection
        title="Initial Portfolio"
        onHelpClick={() => setOpenModal('titleHelp')}>
        <div className="configSection_block">
          <div className="formRow">
            <div className="inputLabel_container">
              <label htmlFor="stockInvestmentValue" className="inputLabel">
                Equities
              </label>
              <button
                title="Learn more about equities"
                className="helpIcon"
                type="button"
                onClick={() => setOpenModal('equities')}>
                <IconHelp />
              </button>
            </div>
            <Input
              {...inputs.stockInvestmentValue.getProps({
                id: 'stockInvestmentValue',
                className: 'input-dollars',
                type: 'number',
                pattern: '\\d*',
                min: 0,
                inputMode: 'decimal',
                autoComplete: 'off',
                prefix: '$',
                onCommit(event, newValue) {
                  commitInput('stockInvestmentValue', newValue);
                },
              })}
            />
          </div>
          <div className="formRow">
            <div className="inputLabel_container">
              <label htmlFor="stockInvestmentFees" className="inputLabel">
                Annual Fees
              </label>
              <button
                title="Learn more about annual investment fees"
                className="helpIcon"
                type="button"
                onClick={() => setOpenModal('fees')}>
                <IconHelp />
              </button>
            </div>
            <Input
              {...inputs.stockInvestmentFees.getProps({
                id: 'stockInvestmentFees',
                className: 'input-percent',
                type: 'number',
                step: 0.01,
                min: 0,
                max: 100,
                inputMode: 'decimal',
                autoComplete: 'off',
                suffix: '%',
                onCommit(event, newValue) {
                  commitInput('stockInvestmentFees', newValue);
                },
              })}
            />
          </div>
        </div>
        {/* <div className="configSection_block">
        <div className="formRow">
          <label htmlFor="bondsValue" className="inputLabel">
            Bonds
          </label>
          <Input
            {...inputs.bondsValue.getProps({
              id: 'bondsValue',
              className: 'input-dollars',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'decimal',
              autoComplete: 'off',
              prefix: '$',
              onCommit(event, newValue) {
                commitInput('bondsValue', newValue);
              },
            })}
          />
        </div>
      </div> */}
      </ConfigSection>
      <Modal
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Initial Portfolio</Modal.Title>
        <Modal.Body>
          <p>
            Your <i>portfolio</i> is made up of all of the financial assets that
            you own, such as stocks or bonds. In this section, you define what
            your portfolio was or will be at the start of your retirement.
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
        active={openModal === 'equities'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Equities</Modal.Title>
        <Modal.Body>
          <p>
            Equities are also known as stocks. For example, if you own shares of{' '}
            <a
              href="https://investor.vanguard.com/mutual-funds/profile/VTSAX"
              rel="noopener noreferrer"
              target="_blank">
              VTSAX
            </a>
            , then you would place the value of those shares here.
          </p>
          <p>
            This calculator only supports a single value for all of your
            equities, so add them all up to get the value to input here.
          </p>
          <p>
            This calculator uses the S&P 500's historical performance data from{' '}
            <a
              href="http://www.econ.yale.edu/~shiller/data.htm"
              target="_blank"
              rel="noreferrer noopener">
              Robert Shiller
            </a>{' '}
            for this value.
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
        active={openModal === 'fees'}
        onBeginClose={() => setOpenModal(null)}>
        <Modal.Title>Annual Fees</Modal.Title>
        <Modal.Body>
          <p>
            Most equities have a yearly fee that you must pay to own the stock.
            Sometimes, it is called an expense ratio. The default value is
            0.04%, which was the expense ratio for{' '}
            <a
              href="https://investor.vanguard.com/mutual-funds/profile/VTSAX"
              rel="noopener noreferrer"
              target="_blank">
              VTSAX
            </a>{' '}
            in April 2020.
          </p>
          <p>
            Because this calculator only supports a single input for all of your
            equities, we recommend choosing an average fee to represent all of
            your holdings.
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
