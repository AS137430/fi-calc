import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import noScroll from 'no-scroll';
import './dialog.css';

export default class Dialog extends Component {
  render() {
    const { open, children, onClickOverlay } = this.props;

    return (
      <Fragment>
        <div
          className={classnames('dialog_overlay', {
            'dialog_overlay-open': open,
          })}
          onClick={e => {
            if (typeof onClickOverlay === 'function') {
              onClickOverlay(e);
            }
          }}
        />
        <div
          className={classnames('dialog', {
            'dialog-open': open,
          })}>
          {children}
        </div>
      </Fragment>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      this.registerEvents();
    } else if (!this.props.open && prevProps.open) {
      this.unregisterEvents();
    }
  }

  registerEvents = () => {
    window.addEventListener('keydown', this.onKeyDown, true);
    noScroll.on();
  };

  unregisterEvents = () => {
    window.removeEventListener('keydown', this.onKeyDown, true);
    noScroll.off();
  };

  onKeyDown = e => {
    const { onEscPressed } = this.props;
    if (e.key === 'Escape') {
      if (typeof onEscPressed === 'function') {
        onEscPressed(e);
      }
    }
  };
}
