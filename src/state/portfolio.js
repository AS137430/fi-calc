import createState from './create-state';
import portfolioPlanConfig from '../form-config/portfolio-form-config';

const [PortfolioProvider, usePorfolio] = createState(portfolioPlanConfig);

export default usePorfolio;
export { PortfolioProvider };
