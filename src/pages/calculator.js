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

  return (
    <div className="calculator">
      {isSmallScreen && (
        <Switch>
          <Route exact path={path} component={Configuration} />
          <Route path={`${path}/results`} component={SimulationsOverview} />
          <Route path={`${path}/year/:year`} component={OneSimulation} />
          <Route component={NotFound} />
        </Switch>
      )}
      {!isSmallScreen && (
        <>
          <Configuration />
          <Switch>
            <Route exact path={path} component={SimulationsOverview} />
            <Route path="/calculator/year/:year" component={OneSimulation} />
            <Route component={NotFound} />
          </Switch>
        </>
      )}
    </div>
  );
}
