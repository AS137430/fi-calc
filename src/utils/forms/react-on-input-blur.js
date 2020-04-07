import _ from 'lodash';

// This small function does two things:
//   1. reverts us to the previous valid value when the input is invalid
//   2. provides a callback to persist the value when it is valid
//
// It is sort of like a "Submit" button functionality for the forms in this app.
export default function reactOnInputBlur({
  inputs,
  updateFormValue,
  prevValidValue,
  id,
  onPersist,
}) {
  const error = _.get(inputs, `${id}.error`);
  const isValid = _.isNull(error);

  if (!isValid) {
    updateFormValue(id, prevValidValue);
  } else {
    onPersist();
  }
}
