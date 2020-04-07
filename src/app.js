import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import './app.css';
import historyWithQuery from './common/utils/history-with-query';
import Sidebar from './sidebar/sidebar';
import Results from './results/results';

const history = historyWithQuery(
  createBrowserHistory(),
  queryString.stringify,
  queryString.parse
);

export default function App() {
  return (
    <Router history={history}>
      <div className="app_body">
        <Sidebar />
        <Results />
      </div>
    </Router>
  );
}
