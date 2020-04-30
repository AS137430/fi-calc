import React, { useState } from 'react';
import classnames from 'classnames';
import { Checkbox } from 'materialish';
import ConfigSection from './sidebar-section';
import useForm from '../hooks/use-form';
import InfoModal from '../common/info-modal';
import Input from '../common/input';
import useHistoricalDataRange from '../state/historical-data-range';
import historicalDataRangeFormConfig from '../form-config/historical-data-range-form-config';

export default function HistoricalDataRangeForm() {
  const { inputs, commitInput, changeCheckbox } = useForm({
    formConfig: historicalDataRangeFormConfig,
    useSourceOfTruth: useHistoricalDataRange,
  });
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <ConfigSection
        title="Historical Data"
        onHelpClick={() => setOpenModal('titleHelp')}>
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
      <InfoModal
        title="Historical Data"
        active={openModal === 'titleHelp'}
        onBeginClose={() => setOpenModal(null)}>
        <p>
          This calculator works by simulating retirements using historical data.
          The full data set spans back to 1871, but sometimes, you may wish to
          restrict your your retirements to a subset of the available data.
        </p>
        <p>
          The original studies that used this method of analysis, for instance,
          only used data from 1926 and later.
        </p>
        <p>
          The data used in this app is from{' '}
          <a
            href="http://www.econ.yale.edu/~shiller/data.htm"
            target="_blank"
            rel="noreferrer noopener">
            Robert Shiller
          </a>
          .
        </p>
      </InfoModal>
    </>
  );
}
