import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import './app.css';
import Footer from './common/footer';
import ScrollToTop from './common/scroll-to-top';
import HistoricalSuccess from './calculator/historical-success';
import historyWithQuery from './common/utils/history-with-query';
import About from './meta/about';
import Terms from './meta/terms';
import Privacy from './meta/privacy';
import Contact from './meta/contact';
import NotFound from './meta/not-found';

const history = historyWithQuery(
  createBrowserHistory(),
  queryString.stringify,
  queryString.parse
);

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <ScrollToTop>
          <div className="app_body">
            <Switch>
              <Route exact path="/" component={HistoricalSuccess} />
              <Route exact path="/about" component={About} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
