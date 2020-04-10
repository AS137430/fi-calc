import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import './app.css';
import historyWithQuery from './utils/routing/history-with-query';
import Configuration from './configuration/configuration';
import Results from './results/results';
import useIsSmallScreen from './hooks/use-is-small-screen';

const history = historyWithQuery(
  createBrowserHistory(),
  queryString.stringify,
  queryString.parse
);

export default function App() {
  const [appPage, setAppPage] = useState('config');

  const isSmallScreen = useIsSmallScreen();

  return (
    <Router history={history}>
      <div className="app_body">
        {!isSmallScreen && (
          <>
            <Configuration />
            <Results />
          </>
        )}
        {isSmallScreen && (
          <>
            {appPage === 'config' && (
              <Configuration goToResults={() => setAppPage('results')} />
            )}
            {appPage === 'results' && (
              <Results goToConfig={() => setAppPage('config')} />
            )}
          </>
        )}
      </div>
    </Router>
  );
}
