import createState from './create-state';
import portfolioFormConfig from '../form-config/portfolio-form-config';

const [PortfolioProvider, usePorfolio] = createState(portfolioFormConfig);

export default usePorfolio;
export { PortfolioProvider };
