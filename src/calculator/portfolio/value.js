import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import formatDollars from '../../utils/numbers/format-dollars';
import DialogForm from './dialog-form';

export default class PortfolioValue extends Component {
  render() {
    const { stockInvestmentValue } = this.props;
    const { isDialogOpen } = this.state;

    return (
      <div className="displayValue_container">
        <div
          tabIndex="0"
          className="displayValue_pill"
          ref={this.valueRef}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              this.setState({ isDialogOpen: true });
            }
          }}
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span className="displayValue_pillValue">
            <span
              role="img"
              aria-label="Stock Chart"
              className="displayValue_emoji">
              📈
            </span>{' '}
            <span className="displayValue_entry">
              {formatDollars(stockInvestmentValue)}
            </span>
          </span>
          <div className="displayValue_detailContainer">
            <span className="displayValue_pillDetail">
              Growth based on historical data
            </span>
          </div>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={() => this.setState({ isDialogOpen: false })}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <DialogForm
              stockInvestmentValue={stockInvestmentValue}
              triggerRef={this.valueRef}
              onClose={() => this.setState({ isDialogOpen: false })}
              onConfirm={this.onConfirm}
            />
          )}
        </TransitionGroupPlus>
      </div>
    );
  }

  valueRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onConfirm = updates => {
    this.props.updateValues(updates);

    this.setState({
      isDialogOpen: false,
    });
  };
}
