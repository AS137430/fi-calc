import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './app.css';
import Nav from './common/nav';
import Footer from './common/footer';
import Home from './pages/home';
import GettingStarted from './pages/getting-started';
import NotFound from './common/not-found';

export default function Website() {
  return (
    <div className="app_body">
      <Nav />
      <div className="app_bodyContents">
        <div className="app_mainContents">
          <main>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/getting-started">
                <GettingStarted />
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
