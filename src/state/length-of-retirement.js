import createState from './create-state';
import lengthOfRetirementFormConfig from '../form-config/length-of-retirement-form-config';

const [LengthOfRetirementProvider, useLengthOfRetirement] = createState(
  lengthOfRetirementFormConfig
);

export default useLengthOfRetirement;
export { LengthOfRetirementProvider };
