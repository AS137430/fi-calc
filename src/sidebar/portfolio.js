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
    <SidebarPanel title="portfolio">
      <div className="formRow">
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
    </SidebarPanel>
  );
}
