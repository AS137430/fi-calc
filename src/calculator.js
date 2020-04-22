import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useCurrentRef } from 'core-hooks';
import './calculator.css';
import Nav from './common/nav';
import Footer from './common/footer';
import Sidebar from './common/sidebar';
import Configuration from './configuration/configuration';
import SimulationsOverview from './results/simulations-overview';
import useIsSmallScreen from './hooks/use-is-small-screen';
import OneSimulation from './results/one-simulation';
import useSimulationResult from './state/simulation-result';

const ROOT_CALCULATOR_PATH = '/calculator';

export default function Calculator() {
  const isSmallScreen = useIsSmallScreen();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { result } = useSimulationResult();

  const pathnameRef = useCurrentRef(pathname);

  // Right now, the app has no state persistence. Therefore,
  // it doesn't make sense to allow the user to visit any other URL other
  // than the root.
  // What this code does is redirect the user back to the calculator root if they
  // refresh on any nested routes.
  // This also catches 404s!
  useEffect(() => {
    if (pathname !== ROOT_CALCULATOR_PATH) {
      history.replace(ROOT_CALCULATOR_PATH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This redirects the user back to the home page
  // any time that the configuration changes.
  // Note: the page that they are receives the update at the same time
  // that this, so components may begin to render with the new data before
  // this transition occurs.
  // A better approach would be to perform this transition _before_ the computation
  // is run in the first place.
  // I could move this to `state/simulation-result.js`, but that doesn't seem very
  // organized.
  useEffect(
    () => {
      if (pathnameRef.current !== ROOT_CALCULATOR_PATH) {
        history.push(ROOT_CALCULATOR_PATH);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result]
  );

  const overviewPaths = isSmallScreen
    ? `${path}/results`
    : [path, `${path}/results`];

  return (
    <div className="app_body app_body-calculator">
      <Nav />
      <div className="app_bodyContents">
        <Sidebar />
        <div className="app_mainContents">
          <main>
            <Switch>
              {isSmallScreen && (
                <Route exact path={path} component={Configuration} />
              )}
              <Route
                exact
                path={overviewPaths}
                component={SimulationsOverview}
              />
              <Route
                path={`/calculator/year/:year`}
                component={OneSimulation}
              />
            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
