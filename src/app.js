import React, { useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import './app.css';
import Configuration from './configuration/configuration';
import SimulationsOverview from './results/simulations-overview';
import NotFound from './common/not-found';
import useIsSmallScreen from './hooks/use-is-small-screen';
import OneSimulation from './results/one-simulation';

//
// This app has a weird URL structure right now.
// This file handles a lot of the heavy lifting, but the OneSimulation component
// does some of the work as well (with the URL of its back link)
//

export default function App() {
  const isSmallScreen = useIsSmallScreen();
  const { pathname } = useLocation();
  const history = useHistory();

  // Right now, the app has no state persistence. Therefore,
  // it doesn't make sense to allow the user to visit any other URL other
  // than the root.
  // What this code does is redirect the user back to the homepage if they
  // refresh on any nested routes.
  useEffect(() => {
    if (pathname !== '/') {
      history.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The /results path only exists for small screens. If you
  // attempt to access it on a large screen, we redirect you back home.
  useEffect(
    () => {
      if (!isSmallScreen && pathname === '/results') {
        history.replace('/');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSmallScreen, pathname]
  );

  return (
    <div className="app_body">
      {isSmallScreen && (
        <Switch>
          <Route exact path="/" component={Configuration} />
          <Route path="/results" component={SimulationsOverview} />
          <Route path="/year/:year" component={OneSimulation} />
          <Route component={NotFound} />
        </Switch>
      )}
      {!isSmallScreen && (
        <>
          <Configuration />
          <Switch>
            <Route exact path="/" component={SimulationsOverview} />
            <Route path="/year/:year" component={OneSimulation} />
            <Route component={NotFound} />
          </Switch>
        </>
      )}
    </div>
  );
}
