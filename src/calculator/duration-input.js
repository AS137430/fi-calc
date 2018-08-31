import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import TransitionGroupPlus from 'react-transition-group-plus';
import './input.css';
import Dialog from './dialog';

export default class DurationInput extends Component {
  render() {
    const { field, fieldName, updateValue, units } = this.props;
    const { isDialogOpen } = this.state;

    return (
      <div>
        <div
          className="input_pill"
          ref={this.pillRef}
          onClick={() => {
            this.setState({ isDialogOpen: true });
          }}>
          <span className="input_pillValue">{field.value}</span>{' '}
          <span className="input_pillUnit">{units}</span>
        </div>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': isDialogOpen,
          })}
          onClick={() => this.setState({ isDialogOpen: false })}
        />
        <TransitionGroupPlus>
          {isDialogOpen && (
            <Dialog
              componentWillEnter={this.onOpen}
              componentWillLeave={this.onClose}
              nodeRef={this.dialogRef}
              open={true}
              onEscPressed={e => {
                e.preventDefault();
                e.stopPropagation();

                this.setState({ isDialogOpen: false });
              }}>
              <h1 className="dialog_header">Duration</h1>
              <div className="dialog_contents">
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
                  onChange={event => updateValue(fieldName, event.target.value)}
                />
                {field.errorMsg && (
                  <div className="calculator-errorMsg">{field.errorMsg}</div>
                )}
              </div>
              <div className="dialog_footer">
                <button
                  className="button"
                  type="button"
                  onClick={() => this.setState({ isDialogOpen: false })}>
                  Cancel
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={this.onConfirmChanges}>
                  Save
                </button>
              </div>
            </Dialog>
          )}
        </TransitionGroupPlus>
      </div>
    );
  }

  pillRef = createRef();
  dialogRef = createRef();

  state = {
    isDialogOpen: false,
  };

  onConfirmChanges = () => {
    this.setState({
      isDialogOpen: false,
    });
  };

  onOpen = cb => {
    const time = 250;
    const triggerEl = this.pillRef.current;
    const tooltipEl = this.dialogRef.current;

    const bb = triggerEl.getBoundingClientRect();
    const mybb = tooltipEl.getBoundingClientRect();
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.opacity = 0;
    tooltipEl.style.transition = 'none';
    tooltipEl.style.transformOrigin = 'top left';
    tooltipEl.style.transform = `translate3d(calc(${bb.x - mybb.x}px), ${bb.y -
      mybb.y}px, 0)
        scale(${bb.width / mybb.width}, ${bb.height / mybb.height})`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tooltipEl.style.transition = `opacity ${time}ms cubic-bezier(0.175, 0.885, 0.32, 1), transform ${time}ms cubic-bezier(0.175, 0.885, 0.32, 1)`;
        tooltipEl.style.opacity = 1;
        tooltipEl.style.transform = 'none';
        setTimeout(() => {
          tooltipEl.style.pointerEvents = 'all';
          cb();
        }, time);
      });
    });
  };

  onClose = cb => {
    const time = 250;
    const triggerEl = this.pillRef.current;
    const tooltipEl = this.dialogRef.current;

    const bb = triggerEl.getBoundingClientRect();
    const mybb = tooltipEl.getBoundingClientRect();
    tooltipEl.style.transition = `opacity ${time}ms cubic-bezier(0.6, -0.28, 0.735, 0.045), transform ${time}ms cubic-bezier(0.6, -0.28, 0.735, 0.045)`;

    requestAnimationFrame(() => {
      tooltipEl.style.opacity = 0;
      tooltipEl.style.transformOrigin = 'top left';
      tooltipEl.style.transform = `translate3d(calc(${bb.x -
        mybb.x}px), ${bb.y - mybb.y}px, 0)
          scale(${bb.width / mybb.width}, ${bb.height / mybb.height})`;

      setTimeout(() => {
        cb();
      }, time);
    });
  };
}
