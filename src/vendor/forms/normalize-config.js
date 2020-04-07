import _ from 'lodash';

export default function normalizeConfig(config) {
  return _.mapValues(config, configVal => {
    let defaultValue = configVal.default;
    if (
      configVal.type === 'enumeration' &&
      typeof defaultValue === 'undefined'
    ) {
      defaultValue = Array.isArray(configVal.values)
        ? configVal.values[0]
        : undefined;
    }

    return {
      ...configVal,
      default: defaultValue,
    };
  });
}
