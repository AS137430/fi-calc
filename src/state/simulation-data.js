import createState from './create-state';
import simulationDataForm from '../form-config/simulation-data-form';

const [SimulationDataProvider, useSimulationData] = createState(
  simulationDataForm
);

export default useSimulationData;
export { SimulationDataProvider };
