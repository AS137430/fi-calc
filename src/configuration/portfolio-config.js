import React from 'react';
import ConfigSection from './config-section';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import usePortfolio from '../state/portfolio';
import porfolioForm from '../form-config/portfolio-form';

export default function PortfolioConfig() {
  const { inputs, commitInput } = useForm({
    formConfig: porfolioForm,
    useSourceOfTruth: usePortfolio,
  });

  return (
    <ConfigSection title="Initial Portfolio">
      <div className="configSection_block">
        <div className="formRow">
          <label htmlFor="stockInvestmentValue" className="inputLabel">
            Equities
          </label>
          <Input
            {...inputs.stockInvestmentValue.getProps({
              id: 'stockInvestmentValue',
              className: 'input-dollars',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              prefix: '$',
              onCommit(event, newValue) {
                commitInput('stockInvestmentValue', newValue);
              },
            })}
          />
        </div>
        <div className="formRow">
          <label htmlFor="stockInvestmentFees" className="inputLabel">
            Annual Fees
          </label>
          <Input
            {...inputs.stockInvestmentFees.getProps({
              id: 'stockInvestmentFees',
              className: 'input-percent',
              type: 'number',
              step: 0.01,
              min: 0,
              max: 100,
              inputMode: 'numeric',
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
              inputMode: 'numeric',
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
  );
}
