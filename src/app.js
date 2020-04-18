import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import './app.css';
import Nav from './common/nav';
import Footer from './common/footer';
import Sidebar from './common/sidebar';
import Home from './pages/home';
import Learn from './pages/learn';
import Calculator from './pages/calculator';
import NotFound from './common/not-found';
import useIsCalculator from './hooks/use-is-calculator';
import useIsSmallScreen from './hooks/use-is-small-screen';
import useSimulationResult from './state/simulation-result';

export default function App() {
  const { result } = useSimulationResult();
  const isSmallScreen = useIsSmallScreen();
  const { pathname } = useLocation();
  const history = useHistory();
  const isCalculator = useIsCalculator();

  // Right now, the app has no state persistence. Therefore,
  // it doesn't make sense to allow the user to visit any other URL other
  // than the root.
  // What this code does is redirect the user back to the homepage if they
  // refresh on any nested routes.
  useEffect(() => {
    // if (pathname !== '/') {
    //   history.replace('/');
    // }
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
      // history.push('/');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result]
  );

  // The /results path only exists for small screens. If you
  // attempt to access it on a large screen, we redirect you back home.
  useEffect(
    () => {
      // if (!isSmallScreen && pathname === '/results') {
      //   history.replace('/');
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSmallScreen, pathname]
  );

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
