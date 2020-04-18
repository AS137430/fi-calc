import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './app.css';
import Website from './website';
import Calculator from './calculator';

export default function App() {
  return (
    <Switch>
      {/*
        Anything under /calculator is served by the calculator "sub-app". This
        allows us to only render the data providers when this "sub-app" mounts.
      */}
      <Route path="/calculator">
        <Calculator />
      </Route>
      {/*
        For all other pages, we redirect to the "website", which has
        guides and so on.
      */}
      <Route>
        <Website />
      </Route>
    </Switch>
  );
}
