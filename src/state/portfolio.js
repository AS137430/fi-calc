import createState from './create-state';
import portfolioPlan from '../form-config/portfolio-form';

const [PortfolioProvider, usePorfolio] = createState(portfolioPlan);

export default usePorfolio;
export { PortfolioProvider };
