import React, { Component } from 'react';
import classnames from 'classnames';
import FocusTrap from 'focus-trap-react';
import noScroll from 'no-scroll';
import './dialog.css';

export default class Dialog extends Component {
  render() {
    const { open, children, className = '', nodeRef } = this.props;

    return (
      <>
        <FocusTrap
          active={open}
          focusTrapOptions={{
            fallbackFocus: document.body,
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
            returnFocusOnDeactivate: false,
          }}>
          <div
            ref={nodeRef}
            className={classnames(`dialog ${className}`, {
              'dialog-open': open,
            })}>
            {children}
          </div>
        </FocusTrap>
      </>
    );
  }

  componentWillEnter(cb) {
    if (this.props.componentWillEnter) {
      this.props.componentWillEnter(cb);
    } else {
      cb();
    }
  }

  componentWillLeave(cb) {
    if (this.props.componentWillLeave) {
      this.props.componentWillLeave(cb);
    } else {
      cb();
    }
  }

  componentDidMount() {
    this.registerEvents();
  }

  componentWillUnmount() {
    this.unregisterEvents();
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
