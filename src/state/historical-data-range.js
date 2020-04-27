import createState from './create-state';
import historicalDataRangeFormConfig from '../form-config/historical-data-range-form-config';

const [HistoricalDataRangeProvider, useHistoricalDataRange] = createState(
  historicalDataRangeFormConfig
);

export default useHistoricalDataRange;
export { HistoricalDataRangeProvider };
