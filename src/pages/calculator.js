import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import './calculator.css';
import Configuration from '../configuration/configuration';
import SimulationsOverview from '../results/simulations-overview';
import NotFound from '../common/not-found';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import OneSimulation from '../results/one-simulation';
import useSimulationResult from '../state/simulation-result';

const ROOT_CALCULATOR_PATH = '/calculator';

export default function Calculator() {
  const isSmallScreen = useIsSmallScreen();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { result } = useSimulationResult();

  // Right now, the app has no state persistence. Therefore,
  // it doesn't make sense to allow the user to visit any other URL other
  // than the root.
  // What this code does is redirect the user back to the calculator root if they
  // refresh on any nested routes.
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
      history.push(ROOT_CALCULATOR_PATH);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result]
  );

  const overviewPaths = isSmallScreen
    ? `${path}/results`
    : [path, `${path}/results`];

  return (
    <div className="calculator">
      <Switch>
        {isSmallScreen && <Route exact path={path} component={Configuration} />}
        <Route exact path={overviewPaths} component={SimulationsOverview} />
        <Route path={`/calculator/year/:year`} component={OneSimulation} />
        <Route component={NotFound} />
      </Switch>

      {/* {!isSmallScreen && (
          <Switch>
            <Route
              exact
              path={}
              component={SimulationsOverview}
            />
            <Route path="/calculator/year/:year" component={OneSimulation} />
            <Route component={NotFound} />
          </Switch>
      )} */}
    </div>
  );
}
