import createState from './create-state';
import lengthOfRetirementForm from '../form-config/length-of-retirement-form';

const [LengthOfRetirementProvider, useLengthOfRetirement] = createState(
  lengthOfRetirementForm
);

export default useLengthOfRetirement;
export { LengthOfRetirementProvider };
