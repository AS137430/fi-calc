import React, { Component } from 'react';
import classnames from 'classnames';
import noScroll from 'no-scroll';
import './historical-success.css';
import computeResult from './compute-result';
import LengthOfRetirementValue from './length-of-retirement/value';
import SpendingValue from './spending-plan/value';
import PortfolioValue from './portfolio/value';
import Results from './results';

export default class HistoricalSuccess extends Component {
  render() {
    const { inputs, result, areResultsOpen } = this.state;
    const {
      stockInvestmentValue,
      firstYearWithdrawal,
      inflationAdjustedFirstYearWithdrawal,
      numberOfYears,
      durationMode,
      startYear,
      endYear,
    } = inputs;
    const { successRate } = result;

    return (
      <div className="historicalSuccess">
        <form className="calculator_form">
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Length of Retirement</h2>
            <LengthOfRetirementValue
              updateValues={this.updateValues}
              numberOfYears={numberOfYears}
              startYear={startYear}
              endYear={endYear}
              durationMode={durationMode}
            />
          </div>
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Spending Plan</h2>
            <SpendingValue
              updateValues={this.updateValues}
              firstYearWithdrawal={firstYearWithdrawal}
              inflationAdjustedFirstYearWithdrawal={
                inflationAdjustedFirstYearWithdrawal
              }
            />
          </div>
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Portfolio</h2>
            <PortfolioValue
              updateValues={this.updateValues}
              stockInvestmentValue={stockInvestmentValue}
            />
          </div>
        </form>
        <div
          className={classnames('calculator_resultsOverlay', {
            'calculator_resultsOverlay-open': areResultsOpen,
          })}
          onClick={this.closeResults}
        />
        <div
          className={classnames('calculator_results', {
            'calculator_results-open': areResultsOpen,
          })}>
          <div
            className="calculator_resultsToggle"
            onClick={this.toggleResults}
          />
          <div>
            <div className="calculator_buttonContainer">
              <button
                className="calculator_viewResultsBtn"
                onClick={this.showResults}>
                View Results
              </button>
            </div>
            <Results
              successRate={successRate}
              isOpen={areResultsOpen}
              onClose={() =>
                this.setState({
                  areResultsOpen: false,
                })
              }
            />
          </div>
        </div>
      </div>
    );
  }

  state = {
    test: '1000',
    inputs: {
      durationMode: 'historicalData',
      numberOfYears: '30',
      startYear: '1932',
      endYear: '1960',
      firstYearWithdrawal: '25000',
      inflationAdjustedFirstYearWithdrawal: true,
      stockInvestmentValue: '625000',
    },
    result: {
      successRate: '',
      dipRate: '',
      summary: '',
      lowestDippedValue: {
        year: '',
        startYear: '',
        value: '',
      },
    },
    areResultsOpen: false,
  };

  componentWillUnmount() {
    // We never want to get in a situation where the scroll is locked when this component doesn't
    // exist :)
    noScroll.off();
  }

  updateValues = values => {
    this.setState(prevState => {
      return {
        inputs: {
          ...prevState.inputs,
          ...values,
        },
      };
    });
  };

  closeResults = () => {
    noScroll.off();

    this.setState({
      areResultsOpen: false,
    });
  };

  showResults = () => {
    const { inputs } = this.state;

    this.setState({
      result: computeResult(inputs),
    });

    this.toggleResults();
  };

  toggleResults = () => {
    this.setState(prevState => {
      if (prevState.areResultsOpen) {
        noScroll.off();

        return {
          areResultsOpen: false,
        };
      }

      noScroll.on();

      return {
        areResultsOpen: true,
      };
    });
  };
}
