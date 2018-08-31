import React, { Component } from 'react';
import './App.css';
import HistoricalSuccess from './calculator/historical-success';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FI Calc</h1>
        </header>
        <HistoricalSuccess />
      </div>
    );
  }
}

export default App;
