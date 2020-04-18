import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import './calculator.css';
import Configuration from '../configuration/configuration';
import SimulationsOverview from '../results/simulations-overview';
import NotFound from '../common/not-found';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import OneSimulation from '../results/one-simulation';

export default function Calculator() {
  const isSmallScreen = useIsSmallScreen();
  const { path } = useRouteMatch();

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
