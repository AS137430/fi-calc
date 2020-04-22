import 'focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import ReactGA from 'react-ga';
import createHistoryWithQuery from './vendor/history';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ScrollToTop from './common/scroll-to-top';
import ErrorBoundary from './error-boundary';
import registerGoogleAnalytics from './utils/analytics/register-google-analytics';

const isProduction = process.env.NODE_ENV === 'production';

const history = createHistoryWithQuery();

if (isProduction) {
  registerGoogleAnalytics();

  history.listen(location => {
    ReactGA.pageview(location.pathname);
  });
}

ReactDOM.render(
  <ErrorBoundary>
    <Router history={history}>
      <App />
      <ScrollToTop />
    </Router>
  </ErrorBoundary>,
  document.getElementById('root')
);
