import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import './app.css';
import Header from './common/header';
import Footer from './common/footer';
import ScrollToTop from './common/scroll-to-top';
import HistoricalSuccess from './calculator/historical-success';
import historyWithQuery from './common/utils/history-with-query';

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
          <Header />
          <div className="app_body">
            <HistoricalSuccess />
          </div>
          <Footer />
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
