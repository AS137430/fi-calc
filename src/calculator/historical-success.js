import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import noScroll from 'no-scroll';
import './historical-success.css';
import './calculator-input.css';
import computeResult from './compute-result';
import DurationInput from './duration-input';
import SpendingInput from './spending-input';
import EquitiesInput from './equities-input';

export default class HistoricalSuccess extends Component {
  render() {
    const { inputs, result, areResultsOpen } = this.state;
    const {
      stockInvestmentValue,
      firstYearWithdrawal,
      numberOfYears,
      durationMode,
    } = inputs;
    const { successRate } = result;

    return (
      <div className="historicalSuccess">
        <form className="calculator_form">
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Length of Retirement</h2>
            <DurationInput
              updateValue={this.updateValue}
              numberOfYears={numberOfYears}
              durationMode={durationMode}
            />
          </div>
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Spending Plan</h2>
            <SpendingInput
              field={firstYearWithdrawal}
              fieldName="firstYearWithdrawal"
              updateValue={this.updateValue}
            />
          </div>
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Portfolio</h2>
            <EquitiesInput
              field={stockInvestmentValue}
              fieldName="stockInvestmentValue"
              updateValue={this.updateValue}
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
                onClick={this.toggleResults}>
                View Results
              </button>
            </div>
            <div className="calculator_resultsText">
              <div>This portfolio succeeded</div>
              <div className="calculator_resultsPercentage">{successRate}</div>
              <div>of the time.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  state = {
    test: '1000',
    inputs: {
      durationMode: 'specificYears',
      numberOfYears: '30',
      stockInvestmentValue: {
        value: '625000',
        error: null,
      },
      firstYearWithdrawal: {
        value: '25000',
        error: null,
      },
      spendingMethod: {
        value: 'inflationAdjusted',
        error: null,
      },
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

  componentDidMount() {
    // We read the input values from the query parameters to set the initial
    // inputs. This allows users to bookmark their calculations
    const initialInputs = _.mapValues(this.state.inputs, value => {
      return value;
    });

    this.setState({
      result: computeResult(initialInputs),
    });
  }

  componentWillUnmount() {
    // We never want to get in a situation where the scroll is locked when this component doesn't
    // exist :)
    noScroll.off();
  }

  updateValue = (valueName, newValue) => {
    const { inputs } = this.state;

    const newInputs = _.merge({}, inputs, {
      [valueName]: {
        value: newValue,
      },
    });

    this.setState({
      result: computeResult(newInputs),
    });
  };

  closeResults = () => {
    noScroll.off();

    this.setState({
      areResultsOpen: false,
    });
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
