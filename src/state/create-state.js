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
