import _ from 'lodash';
// import errorMessages from './error-messages';

// Pass in some `inputs`, and you'll get a copy of it back with
// updated errors.
function computeInputErrors(inputs, validators) {
  return _.mapValues(inputs, (inputObj, inputName) => {
    const validationFns = validators[inputName];

    let validationError;
    _.forEach(validationFns, fn => {
      validationError = fn(inputObj.value, inputs);
      if (validationError) {
        return false;
      }
    });

    if (!validationError) {
      return {
        ...inputObj,
        error: null,
        errorMsg: null,
      };
    }

    // const validationCode = _.get(validationError, 'code', validationError);
    // let validationErrorFn = errorMessages[validationCode];
    let validationErrorFn;

    let validationErrorMsg;
    if (validationErrorFn) {
      validationErrorMsg = validationErrorFn(
        inputName,
        inputObj,
        inputs,
        validationError
      );
    } else {
      validationErrorMsg = null;
    }

    return {
      ...inputObj,
      error: validationError,
      errorMsg: validationErrorMsg,
    };
  });
}

export function getUpdatedInputFormState({ inputs, validators }) {
  const newInputs = computeInputErrors(inputs, validators);

  const formIsInvalid = _.chain(newInputs)
    .mapValues('error')
    .some()
    .value();

  return {
    isFormValid: !formIsInvalid,
    inputs: newInputs,
  };
}

// export function getFormUrl(location, inputs) {
//   const { pathname } = location;

//   const inputValues = _.mapValues(inputs, 'value');
//   const qs = queryString.stringify(inputValues);

//   return `${window.location.origin}${pathname}?${qs}`;
// }
