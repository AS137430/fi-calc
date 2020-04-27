import createState from './create-state';
import historicalDataForm from '../form-config/historical-data-form';

const [HistoricalDataProvider, useHistoricalData] = createState(
  historicalDataForm
);

export default useHistoricalData;
export { HistoricalDataProvider };
