import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useCurrentRef } from 'core-hooks';
import { useForm as useVendorForm } from '../vendor/forms';
import useUndo from './use-undo';

// This manages the interplay between form state (which can be invalid...it is whatever the user has
// typed in), and the "source of truth" state that's in context, which is what the results are always
// based off of.

export default function useForm({ formConfig, useSourceOfTruth }) {
  // This is the state that's stored in context.
  const { state, setState } = useSourceOfTruth();

  const useFormOptions = useMemo(() => {
    return _.mapValues(formConfig.values, (val, key) => {
      return state[key];
    });
  }, []);

  const { addReverseAction } = useUndo();
  const { inputs, updateFormValue } = useVendorForm(
    formConfig.getUseFormOptions(useFormOptions)
  );

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

  return {
    state,
    setState,
    addReverseAction,
    inputs,
    updateFormValue,
    inputsRef,
    stateRef,
    changeSelect,
  };
}
