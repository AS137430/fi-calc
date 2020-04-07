import { useState, useMemo } from 'react';
import _ from 'lodash';
import constate from 'constate';
import { createSetter } from '../vendor/forms';

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

  return constate(useStateContext);
}
