import React, { Component } from 'react';
import HistoricalSuccess from './calculator/historical-success';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="app_body">
        <HistoricalSuccess />
      </div>
    );
  }
}

export default App;
