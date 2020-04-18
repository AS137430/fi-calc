import React from 'react';
import classnames from 'classnames';
import { Checkbox } from 'materialish';
import ConfigSection from './sidebar-section';
import useForm from '../hooks/use-form';
import Input from '../common/input';
import useSimulationData from '../state/simulation-data';
import simulationDataForm from '../form-config/simulation-data-form';

export default function HistoricalDataConfig() {
  const { inputs, commitInput, changeCheckbox } = useForm({
    formConfig: simulationDataForm,
    useSourceOfTruth: useSimulationData,
  });

  return (
    <>
      <ConfigSection title="Historical Data">
        <ConfigSection.Contents>
          <div className="formRow formRow-flex">
            <Checkbox
              className="checkbox"
              id="useAllHistoricalData"
              checked={inputs.useAllHistoricalData.value}
              onChange={event => changeCheckbox('useAllHistoricalData', event)}
            />
            <label htmlFor="useAllHistoricalData" className="checkbox_label">
              Use all available historical data
            </label>
          </div>
          <div className="formRow_separator" />
          <div className="inputLabel_container">
            <label
              htmlFor="firstYear"
              className={classnames('inputLabel', {
                'inputLabel-disabled': inputs.useAllHistoricalData.value,
              })}>
              Only use data between
            </label>
          </div>
          <div className="formRow">
            <Input
              {...inputs.firstYear.getProps({
                id: 'firstYear',
                className: 'input-year',
                type: 'number',
                pattern: '\\d*',
                min: 0,
                max: 300,
                step: 1,
                inputMode: 'numeric',
                autoComplete: 'off',
                disabled: inputs.useAllHistoricalData.value,
                onCommit(event, newValue) {
                  commitInput('firstYear', newValue);
                },
              })}
            />
          </div>
          <div className="inputLabel_container">
            <label
              htmlFor="lastYear"
              className={classnames('inputLabel', {
                'inputLabel-disabled': inputs.useAllHistoricalData.value,
              })}>
              and
            </label>
          </div>
          <div className="formRow">
            <Input
              {...inputs.lastYear.getProps({
                id: 'lastYear',
                className: 'input-year',
                type: 'number',
                pattern: '\\d*',
                min: 0,
                max: 300,
                step: 1,
                inputMode: 'numeric',
                autoComplete: 'off',
                disabled: inputs.useAllHistoricalData.value,
                onCommit(event, newValue) {
                  commitInput('lastYear', newValue);
                },
              })}
            />
          </div>
        </ConfigSection.Contents>
      </ConfigSection>
    </>
  );
}
