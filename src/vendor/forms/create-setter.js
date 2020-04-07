export default function createSetter(setState, config) {
  return function update(update) {
    let needsUpdate = false;

    const updateObj = {};
    for (let stateKey in config) {
      const requiredType = config[stateKey];
      const updatedValue = update[stateKey];

      if (typeof updatedValue === requiredType) {
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
