import _ from 'lodash';
import normalizeConfig from './normalize-config';
import * as parseQueryParams from './parse-query-params';

export default function settingsFromLocation(location, config) {
  const normalizedConfig = normalizeConfig(config);

  const validOptions = Object.keys(normalizedConfig);
  const defaults = _.mapValues(normalizedConfig, settingConfig => {
    return settingConfig.default;
  });

  return _.chain(location)
    .get('query', {})
    .pick(validOptions)
    .mapValues((queryVal, queryKey) => {
      const settingConfig = normalizedConfig[queryKey];
      const parseFn = parseQueryParams[settingConfig.type];
      const parsedVal = parseFn(queryVal, settingConfig);

      return parsedVal;
    })
    .defaults(defaults)
    .value();
}
