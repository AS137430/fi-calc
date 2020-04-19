import React from 'react';
// import { Checkbox } from 'materialish';
import ConfigSection from '../sidebar-section';
// import useForm from '../../hooks/use-form';
// import Input from '../../common/input';
// import useLengthOfRetirement from '../../state/length-of-retirement';
// import lengthOfRetirementForm from '../../form-config/length-of-retirement-form';

export default function LengthOfRetirementConfig() {
  // const { inputs, commitInput, changeCheckbox } = useForm({
  //   formConfig: lengthOfRetirementForm,
  //   useSourceOfTruth: useLengthOfRetirement,
  // });

  return (
    <>
      <ConfigSection title="Additional Spending" initialIsOpen>
        <ConfigSection.Contents className="form_blockSection">
          <div className="formRow_block">
            <div className="formBlock_title">College - $40,000</div>
          </div>
          <button className="button button-secondary button-small">
            + Add Additional Spending
          </button>
        </ConfigSection.Contents>
      </ConfigSection>
    </>
  );
}
