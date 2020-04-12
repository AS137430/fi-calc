import { useState, useRef } from 'react';
import _ from 'lodash';
// import errorMessages from '../utils/forms/error-messages';

function computeInputErrors(inputs) {
  return _.mapValues(inputs, (inputObj, inputName) => {
    const validationFns = inputObj.validators;
    const valueKey = inputObj.isCheckbox ? 'checked' : 'value';

    let validationError;
    _.forEach(validationFns, fn => {
      validationError = fn(inputObj[valueKey], inputs);
      if (validationError) {
        return false;
      }
    });

    if (!validationError) {
      return { ...inputObj, error: null, errorMsg: null };
    }

    // This app does not currently display error messages, so that is why this is commented out.
    // const validationCode = _.get(validationError, 'code', validationError);
    // let validationErrorFn = errorMessages[validationCode];
    let validationErrorFn;

    let validationErrorMsg;
    if (typeof validationErrorFn === 'function') {
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

export default function useForm(initialData) {
  const valuesRef = useRef({});
  const setFormValuesRef = useRef();

  function updateFormValue(inputName, newValue) {
    const currentVal = _.get(valuesRef, `current.${inputName}`, {});
    const isCheckbox = currentVal.isCheckbox;
    const valueKey = isCheckbox ? 'checked' : 'value';

    const newFormState = {
      ...valuesRef.current,
      [inputName]: {
        ...currentVal,
        [valueKey]: newValue,
        dirty: true,
      },
    };

    const newFormStateWithErrors = computeInputErrors(newFormState);

    // TYPE TODO
    // TypeScript was complaining about this possibly being undefined,
    // and I was unable to resolve the problem in any other way
    _.invoke(setFormValuesRef, 'current', newFormStateWithErrors);
  }

  function updateFormValues(values = {}) {
    const newFormState = {
      ...valuesRef.current,
    };

    _.forEach(values, (newValue, inputName) => {
      const currentVal = _.get(valuesRef, `current.${inputName}`, {});
      const isCheckbox = currentVal.isCheckbox;
      const valueKey = isCheckbox ? 'checked' : 'value';

      newFormState[inputName] = {
        ...currentVal,
        [valueKey]: newValue,
        dirty: true,
      };
    });

    const newFormStateWithErrors = computeInputErrors(newFormState);

    // TYPE TODO
    // TypeScript was complaining about this possibly being undefined,
    // and I was unable to resolve the problem in any other way
    _.invoke(setFormValuesRef, 'current', newFormStateWithErrors);
  }

  const initialState = _.mapValues(initialData, (val, inputName) => {
    const isCheckbox = val.isCheckbox;

    const initialInputState = {
      ...val,
      value: val.initialValue,
      error: null,
      errorMsg: null,
      dirty: false,
      touched: false,
      getProps({ onCommit, ...props }) {
        const valueKey = isCheckbox ? 'checked' : 'value';
        const defaultValue = isCheckbox ? undefined : '';

        function commit(event) {
          const currentVal = valuesRef.current[inputName] || {};

          let newValue = currentVal.value;
          if (typeof currentVal.transformOnBlur === 'function') {
            newValue = currentVal.transformOnBlur({
              value: currentVal.value,
            });
          }

          const newFormState = {
            ...valuesRef.current,
            [inputName]: {
              ...currentVal,
              value: newValue,
              touched: true,
            },
          };

          // TYPE TODO
          // TypeScript was complaining about this possibly being undefined,
          // and I was unable to resolve the problem in any other way
          _.invoke(setFormValuesRef, 'current', newFormState);

          if (typeof onCommit === 'function') {
            onCommit(event, newValue);
          }
        }

        return {
          ...props,
          [valueKey]: _.get(
            valuesRef,
            `current.[${inputName}].${valueKey}`,
            defaultValue
          ),
          onChange(event) {
            const updatedValue =
              event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value;

            updateFormValue(inputName, updatedValue);

            if (props && typeof props.onChange === 'function') {
              props.onChange(event);
            }
          },
          onBlur(event) {
            commit(event);

            if (props && typeof props.onBlur === 'function') {
              props.onBlur(event);
            }
          },
          onKeyDown(event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              commit(event);
            }

            if (props && typeof props.onKeyDown === 'function') {
              props.onKeyDown(event);
            }
          },
        };
      },
    };

    if (!isCheckbox) {
      initialInputState.value = val.initialValue;
    } else {
      initialInputState.checked = val.initialValue;
    }

    return initialInputState;
  });

  const [values, setFormValues] = useState(() =>
    computeInputErrors(initialState)
  );

  const formIsValid = !_.chain(values)
    .mapValues('error')
    .some()
    .value();

  valuesRef.current = values;
  setFormValuesRef.current = setFormValues;

  function resetForm() {
    setFormValues(computeInputErrors(initialState));
  }

  return {
    inputs: values,
    formIsValid,
    resetForm,
    updateFormValue,
    updateFormValues,
  };
}
