import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import noScroll from 'no-scroll';
import './historical-success.css';
import validators from './validators';
import computeResult from './compute-result';
import maxDollarInput from '../utils/forms/max-dollar-input';
import { getUpdatedFormState } from '../utils/forms/form-utils';

const summaryMaps = {
  SUCCESSFUL: {
    emoji: '1f44d-1f3fe.png',
  },
  UNSUCCESSFUL: {
    emoji: '26a0-fe0f.png',
  },
};

export default class HistoricalSuccess extends Component {
  render() {
    const { inputs, result, isFormValid, areResultsOpen } = this.state;
    const { stockInvestmentValue, firstYearWithdrawal, duration } = inputs;
    const { summary, successRate } = result;

    const summaryText = `This portfolio succeeded ${successRate} of the time.`;

    let summaryImg;
    if (summary) {
      const resultData = summaryMaps[summary];
      summaryImg = resultData.emoji;
    } else {
      summaryImg = '';
    }

    return (
      <div className="historicalSuccess">
        <form className="calculatorPage-calculator">
          <div className="calculatorPage_formRow">
            <label
              className={classnames('form-label calculatorPage-label', {
                'form-label_error': duration.error,
              })}
              htmlFor="inflationAdjusted_duration">
              Duration
            </label>
            <input
              value={duration.value}
              className={classnames('input calculatorPage-input', {
                input_error: duration.error,
              })}
              type="number"
              pattern="\d*"
              inputMode="numeric"
              step="1"
              min="0"
              max="300"
              id="inflationAdjusted_duration"
              onChange={event =>
                this.updateValue('duration', event.target.value)
              }
            />
            {duration.errorMsg && (
              <div className="calculatorPage-errorMsg">{duration.errorMsg}</div>
            )}
          </div>
          <div className="calculatorPage_formRow">
            <label
              className={classnames('form-label calculatorPage-label', {
                'form-label_error': stockInvestmentValue.error,
              })}
              htmlFor="historicalSuccess_stockInvestmentValue">
              Initial Portfolio Value
            </label>
            <input
              value={stockInvestmentValue.value}
              className={classnames('input calculatorPage-input', {
                input_error: stockInvestmentValue.error,
              })}
              type="number"
              inputMode="numeric"
              min="0"
              max={maxDollarInput}
              id="historicalSuccess_stockInvestmentValue"
              onChange={event =>
                this.updateValue('stockInvestmentValue', event.target.value)
              }
            />
            {stockInvestmentValue.errorMsg && (
              <div className="calculatorPage-errorMsg">
                {stockInvestmentValue.errorMsg}
              </div>
            )}
          </div>
          <div className="calculatorPage_formRow">
            <label
              className={classnames('form-label calculatorPage-label', {
                'form-label_error': firstYearWithdrawal.error,
              })}
              htmlFor="inflationAdjusted_firstYearWithdrawal">
              First Year Withdrawal
            </label>
            <input
              value={firstYearWithdrawal.value}
              className={classnames('input calculatorPage-input', {
                input_error: firstYearWithdrawal.error,
              })}
              type="number"
              min="0"
              max={maxDollarInput}
              inputMode="numeric"
              id="inflationAdjusted_firstYearWithdrawal"
              onChange={event =>
                this.updateValue('firstYearWithdrawal', event.target.value)
              }
            />
            {firstYearWithdrawal.errorMsg && (
              <div className="calculatorPage-errorMsg">
                {firstYearWithdrawal.errorMsg}
              </div>
            )}
            <div />
          </div>
        </form>
        {isFormValid && (
          <div className="calculator_resultsContainer">
            <div
              className={classnames('calculatorPage_resultOverlay', {
                'calculatorPage_resultOverlay-open': areResultsOpen,
              })}
              onClick={this.closeResults}
            />
            <div
              className={classnames('calculatorPage-emojiResultContainer', {
                'calculatorPage-emojiResultContainer-open': areResultsOpen,
              })}>
              <div
                className="calculatorPage_resultsToggle"
                onClick={this.toggleResults}
              />
              <span>
                {summaryImg && (
                  <img
                    alt=""
                    className="emoji-img calculatorPage-emojiResult"
                    src={`/${summaryImg}`}
                  />
                )}
              </span>
              <div>
                <span className="calculatorPage-viewResultsText">
                  {summaryText}
                </span>
              </div>
            </div>
          </div>
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
