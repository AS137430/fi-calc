import 'focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createHistoryWithQuery from './vendor/history';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ScrollToTop from './common/scroll-to-top';
import ErrorBoundary from './error-boundary';
import StateProviders from './state/providers';

const history = createHistoryWithQuery();

ReactDOM.render(
  <ErrorBoundary>
    <StateProviders>
      <Router history={history}>
        <App />
        <ScrollToTop />
      </Router>
    </StateProviders>
  </ErrorBoundary>,
  document.getElementById('root')
);
