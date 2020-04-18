import React from 'react';
import classnames from 'classnames';
import { Switch, Route } from 'react-router-dom';
import './app.css';
import Nav from './common/nav';
import Footer from './common/footer';
import Sidebar from './common/sidebar';
import Home from './pages/home';
import Learn from './pages/learn';
import Calculator from './pages/calculator';
import NotFound from './common/not-found';
import useIsCalculator from './hooks/use-is-calculator';

export default function App() {
  const isCalculator = useIsCalculator();

  return (
    <div
      className={classnames('app_body', {
        'app_body-calculator': isCalculator,
      })}>
      <Nav />
      <div className="bodyContents">
        <Sidebar />
        <div className="app_mainContent">
          <main>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/learn">
                <Learn />
              </Route>
              <Route path="/calculator">
                <Calculator />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
