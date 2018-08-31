import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import noScroll from 'no-scroll';
import './historical-success.css';
import validators from './validators';
import computeResult from './compute-result';
import DurationInput from './duration-input';
import SpendingInput from './spending-input';
import EquitiesInput from './equities-input';
import { getUpdatedFormState } from '../utils/forms/form-utils';

export default class HistoricalSuccess extends Component {
  render() {
    const { inputs, result, isFormValid, areResultsOpen } = this.state;
    const { stockInvestmentValue, firstYearWithdrawal, duration } = inputs;
    const { successRate } = result;

    const summaryText = `This portfolio succeeded ${successRate} of the time.`;

    return (
      <div className="historicalSuccess">
        <form className="calculator_form">
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Duration</h2>
            <DurationInput
              field={duration}
              fieldName="duration"
              units="years"
              updateValue={this.updateValue}
            />
          </div>
          <div className="calculator_formRow">
            <h2 className="calculator_sectionHeader">Spending</h2>
            <SpendingInput
              field={firstYearWithdrawal}
              fieldName="firstYearWithdrawal"
              updateValue={this.updateValue}
              units="/ year"
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
        {isFormValid && (
          <Fragment>
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
                <span className="calculator_resultsText">{summaryText}</span>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }

  state = {
    test: '1000',
    inputs: {
      stockInvestmentValue: {
        value: '625000',
        error: null,
      },
      firstYearWithdrawal: {
        value: '25000',
        error: null,
      },
      duration: {
        value: '30',
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
    isFormValid: true,
  };

  componentDidMount() {
    // We read the input values from the query parameters to set the initial
    // inputs. This allows users to bookmark their calculations
    const initialInputs = _.mapValues(this.state.inputs, value => {
      return value;
    });

    const newFormState = getUpdatedFormState({
      inputs: initialInputs,
      validators,
      computeResult,
    });
    this.setState(newFormState);
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

    const newFormState = getUpdatedFormState({
      inputs: newInputs,
      computeResult,
      validators,
    });
    this.setState({
      ...newFormState,
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
