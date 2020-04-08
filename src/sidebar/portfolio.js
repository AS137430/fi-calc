import React from 'react';
import SidebarPanel from './sidebar-panel';
import useForm from '../hooks/use-form';
import ValueInput from '../common/value-input';
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
          <ValueInput
            {...inputs.stockInvestmentValue.getProps({
              id: 'stockInvestmentValue',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              unit: '$',
              suffix: false,
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
          <ValueInput
            {...inputs.stockInvestmentFees.getProps({
              id: 'stockInvestmentFees',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              unit: '%',
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
          <ValueInput
            {...inputs.bondsValue.getProps({
              id: 'bondsValue',
              type: 'number',
              pattern: '\\d*',
              min: 0,
              inputMode: 'numeric',
              autoComplete: 'off',
              unit: '$',
              suffix: false,
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
