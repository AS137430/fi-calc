import 'focus-visible';
import React from 'react';
import ReactDOM from 'react-dom';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ErrorBoundary from './error-boundary';
import StateProviders from './state/providers';

ReactDOM.render(
  <ErrorBoundary>
    <StateProviders>
      <App />
    </StateProviders>
  </ErrorBoundary>,
  document.getElementById('root')
);
