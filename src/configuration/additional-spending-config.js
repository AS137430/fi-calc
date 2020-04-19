import React from 'react';
import { Checkbox } from 'materialish';
import ConfigSection from './sidebar-section';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import useLengthOfRetirement from '../state/length-of-retirement';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

export default function LengthOfRetirementConfig() {
  const { inputs, commitInput, changeCheckbox } = useForm({
    formConfig: lengthOfRetirementForm,
    useSourceOfTruth: useLengthOfRetirement,
  });

  return (
    <>
      <ConfigSection title="Additional Spending" initialIsOpen>
        <ConfigSection.Contents className="form_blockSection">
          <div className="formRow_block">
            {/* <div className="inputLabel_container">
              <label htmlFor="stockInvestmentValue" className="inputLabel">
                Spending Name
              </label>
            </div> */}
            <div className="formRow">
              <Input
                {...inputs.numberOfYears.getProps({
                  id: 'numberOfYears',
                  className: 'input',
                  type: 'number',
                  pattern: '\\d*',
                  min: 0,
                  prefix: 'Name',
                  inputMode: 'decimal',
                  autoComplete: 'off',
                  onCommit(event, newValue) {
                    commitInput('numberOfYears', newValue);
                  },
                })}
              />
            </div>
            {/* <div className="inputLabel_container">
              <label htmlFor="stockInvestmentValue" className="inputLabel">
                Spending Amount
              </label>
            </div> */}
            <div className="formRow">
              <Input
                {...inputs.numberOfYears.getProps({
                  id: 'numberOfYears',
                  className: 'input-dollars',
                  type: 'number',
                  pattern: '\\d*',
                  min: 0,
                  inputMode: 'decimal',
                  autoComplete: 'off',
                  prefix: '$',
                  onCommit(event, newValue) {
                    commitInput('numberOfYears', newValue);
                  },
                })}
              />
            </div>
            <div className="formRow formRow-flex">
              <Checkbox
                className="checkbox"
                // id="gkModifiedWithdrawalRule"
                checked={true}
                onChange={event =>
                  changeCheckbox('gkModifiedWithdrawalRule', event)
                }
              />
              <label
                htmlFor="gkModifiedWithdrawalRule"
                className="checkbox_label">
                Adjust for inflation
              </label>
            </div>
            <div className="formRow_separator" />
            <div className="formRow formRow-flex">
              <Checkbox
                className="checkbox"
                // id="gkModifiedWithdrawalRule"
                checked={true}
                onChange={event =>
                  changeCheckbox('gkModifiedWithdrawalRule', event)
                }
              />
              <label
                htmlFor="gkModifiedWithdrawalRule"
                className="checkbox_label">
                Repeat for multiple years
              </label>
            </div>
            <div className="inputLabel_container">
              <label htmlFor="stockInvestmentValue" className="inputLabel">
                Spending occurs
              </label>
            </div>
            <div className="formRow">
              <Input
                {...inputs.numberOfYears.getProps({
                  id: 'numberOfYears',
                  className: 'input-year',
                  type: 'number',
                  pattern: '\\d*',
                  min: 0,
                  inputMode: 'decimal',
                  autoComplete: 'off',
                  suffix: 'years into retirement',
                  onCommit(event, newValue) {
                    commitInput('numberOfYears', newValue);
                  },
                })}
              />
            </div>
            <div className="inputLabel_container">
              <label
                htmlFor="stockInvestmentValue"
                className="inputLabel inputLabel-disabled">
                Spending ends
              </label>
            </div>
            <div className="formRow">
              <Input
                {...inputs.numberOfYears.getProps({
                  id: 'numberOfYears',
                  className: 'input-year',
                  type: 'number',
                  pattern: '\\d*',
                  min: 0,
                  inputMode: 'decimal',
                  disabled: true,
                  autoComplete: 'off',
                  suffix: 'years into retirement',
                  onCommit(event, newValue) {
                    commitInput('numberOfYears', newValue);
                  },
                })}
              />
            </div>
          </div>
          <div className="formRow_block">+ Add Additional Spending</div>
        </ConfigSection.Contents>
      </ConfigSection>
    </>
  );
}
