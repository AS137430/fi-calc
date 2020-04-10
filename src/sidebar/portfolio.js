import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import usePortfolio from '../state/portfolio';
import porfolioForm from '../form-config/portfolio-form';

export default function Portfolio() {
  const { inputs, commitInput } = useForm({
    formConfig: porfolioForm,
    useSourceOfTruth: usePortfolio,
  });

  return (
    <SidebarPanel title="Initial Portfolio">
      <div className="sidebarPanel_section">
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
              pattern: '\\d*',
              min: 0,
              max: 1,
              step: 0.01,
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
      <div className="sidebarPanel_section">
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
      </div>
    </SidebarPanel>
  );
}
