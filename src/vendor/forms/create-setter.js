function isPrimitive(val) {
  if (typeof val === 'object') {
    return val === null;
  }
  return typeof val !== 'function';
}

export default function createSetter(setState, config) {
  return function update(update) {
    let needsUpdate = false;

    const updateObj = {};
    for (let stateKey in config) {
      const requiredType = config[stateKey];
      const updatedValue = update[stateKey];

      // TODO: when it isn't primitive, I could check the value of the key.
      if (!isPrimitive(updatedValue) || typeof updatedValue === requiredType) {
        needsUpdate = true;
        updateObj[stateKey] = updatedValue;
      }
    }

    if (needsUpdate) {
      setState(prevState => {
        return {
          ...prevState,
          ...updateObj,
        };
      });
    }
  };
}
