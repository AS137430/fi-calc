import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import constate from 'constate';
import { createSetter, settingsFromLocation } from '../vendor/forms';

export default function createState(formConfig) {
  const setterConfig = _.mapValues(formConfig.values, val => {
    return val.type || val.keyType;
  });

  function useStateContext({ defaultValues = {} } = {}) {
    const [state, naiveSetState] = useState(defaultValues);
    const setState = useMemo(
      () => createSetter(naiveSetState, setterConfig),
      []
    );
    return { state, setState };
  }

  const [Provider, useContextState] = constate(useStateContext);

  // TODO: no reason to pass this into the provider. It can be access in-scope if I move
  // it higher in this function.
  const defaultValues = settingsFromLocation(
    window.location,
    formConfig.values
  );

  function ProviderWrapper({ children, ...rest }) {
    return (
      <Provider {...rest} defaultValues={defaultValues}>
        {children}
      </Provider>
    );
  }

  return [ProviderWrapper, useContextState];
}
