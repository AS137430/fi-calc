import React, { Component } from 'react';
import classnames from 'classnames';
import './input.css';
import Dialog from './dialog';

export default class Input extends Component {
  render() {
    const { field, fieldName, units } = this.props;
    const { isDialogOpen } = this.state;

    return (
      <div>
        <div
          className="input_pill"
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span className="input_pillValue">{field.value}</span>{' '}
          <span className="input_pillUnit">{units}</span>
        </div>
        <Dialog
          open={isDialogOpen}
          onEscPressed={e => {
            e.preventDefault();
            e.stopPropagation();

            this.setState({ isDialogOpen: false });
          }}
          onClickOverlay={() => this.setState({ isDialogOpen: false })}>
          <input
            value={field.value}
            className={classnames('input calculator-input', {
              input_error: field.error,
            })}
            type="number"
            pattern="\d*"
            inputMode="numeric"
            step="1"
            min="0"
            max="300"
            id={`inflationAdjusted_${fieldName}`}
            onChange={event => this.updateValue(fieldName, event.target.value)}
          />
          {field.errorMsg && (
            <div className="calculator-errorMsg">{field.errorMsg}</div>
          )}
        </Dialog>
      </div>
    );
  }

  state = {
    isDialogOpen: false,
  };
}
