import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useCurrentRef } from 'core-hooks';
import { useForm as useVendorForm } from '../vendor/forms';
import useUndo from './use-undo';
import reactOnInputBlur from '../utils/forms/react-on-input-blur';

// This manages the interplay between form state (which can be invalid...it is whatever the user has
// typed in), and the "source of truth" state that's in context, which is what the results are always
// based off of.

export default function useForm({ formConfig, useSourceOfTruth }) {
  // This is the state that's stored in context.
  const { state, setState } = useSourceOfTruth();

  const useVendorFormOptions = useMemo(() => {
    return _.mapValues(formConfig.values, (val, key) => {
      return {
        validators: formConfig.values[key].validators,
        initialValue: state[key],
      };
    });
  }, []);

  const { addReverseAction } = useUndo();
  const { inputs, updateFormValue } = useVendorForm(useVendorFormOptions);

  const inputsRef = useCurrentRef(inputs);
  const stateRef = useCurrentRef(state);

  // Should there be an onChange for each kind of select? Probably, why not?
  const changeSelect = useCallback((id, e) => {
    const prevValidValue = stateRef.current[id];
    const { value } = e.target;

    if (prevValidValue === value) {
      return;
    }

    addReverseAction(() => {
      updateFormValue(id, prevValidValue);
      setState({ [id]: prevValidValue });
    });

    // This is a select, so the value is also valid. We set the form AND update the "source of truth" state used in
    // the calculation.
    updateFormValue(id, value);
    setState({ [id]: value });
  }, []);

  const changeCheckbox = useCallback((id, e) => {
    const prevValidValue = stateRef.current[id];
    const { checked } = e.target;

    if (prevValidValue === checked) {
      return;
    }

    addReverseAction(() => {
      updateFormValue(id, prevValidValue);
      setState({ [id]: prevValidValue });
    });

    // This is a select, so the value is also valid. We set the form AND update the "source of truth" state used in
    // the calculation.
    updateFormValue(id, checked);
    setState({ [id]: checked });
  }, []);

  const commitInput = useCallback((id, newValue) => {
    const prevValidValue = stateRef.current[id];

    const isNumber = formConfig.values[id]?.type === 'number';
    const parsedNewValue = isNumber ? Number(newValue) : newValue;

    // If the value has not changed, then we do not need to take any action
    if (parsedNewValue === prevValidValue) {
      return;
    }

    reactOnInputBlur({
      id,
      prevValidValue,
      inputs: inputsRef.current,
      updateFormValue,
      onPersist() {
        addReverseAction(() => {
          updateFormValue(id, prevValidValue);

          setState({
            [id]: prevValidValue,
          });
        });

        setState({
          [id]: parsedNewValue,
        });
      },
    });
  });

  return {
    state,
    setState,
    addReverseAction,
    inputs,
    updateFormValue,
    inputsRef,
    stateRef,
    changeSelect,
    changeCheckbox,
    commitInput,
  };
}
