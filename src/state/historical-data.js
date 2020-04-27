import createState from './create-state';
import historicalDataFormConfig from '../form-config/historical-data-form-config';

const [HistoricalDataProvider, useHistoricalData] = createState(
  historicalDataFormConfig
);

export default useHistoricalData;
export { HistoricalDataProvider };
