import React from 'react';
import ReactDOM from 'react-dom';
import 'materialish/materialish.css';
import './index.css';
import './normalize.css';
import App from './app';
import ErrorBoundary from './error-boundary';

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
