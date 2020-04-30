import React, { Component } from 'react';
import './expandable.css';

export default class Expandable extends Component {
  render() {
    const {
      className = '',
      durationMs,
      onTransitionEnd,
      onTransitionStart,
      nodeRef,
      children,
      ...props
    } = this.props;
    const { isOpen, isRendering } = this.state;

    return (
      <div
        ref={this.getRef}
        className={`mt-expandable ${
          isOpen ? 'mt-expandable-open' : ''
        } ${className}`}
        {...props}>
        {isRendering && children}
      </div>
    );
  }

  getSnapshotBeforeUpdate() {
    return this.el ? this.el.getBoundingClientRect() : null;
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.open,
      isRendering: true,
      isAnimating: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // When the open prop differs from our previous state, then we either need to
    // start animating, or we need to queue the open
    if (nextProps.open !== prevState.isOpen) {
      if (!prevState.isAnimating) {
        return {
          isAnimating: true,
          isRendering: nextProps.open === true ? true : prevState.isRendering,
          isOpen: nextProps.open,
        };
      }

      return null;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot && this.el) {
      if (prevState.isOpen !== this.state.isOpen) {
        const { durationMs = 150 } = this.props;

        const animationType = this.state.isOpen ? 'open' : 'close';

        if (this.props.onTransitionStart) {
          this.props.onTransitionStart(animationType);
        }

        const bb = this.el.getBoundingClientRect();
        this.el.style.height = `${snapshot.height}px`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.el.style.transition = `all ${durationMs}ms ease-out`;
            this.el.style.height = `${bb.height}px`;

            setTimeout(() => {
              this.el.style = '';

              const newState = {
                isAnimating: false,
              };

              if (animationType === 'close') {
                newState.isRendering = false;
              }

              this.setState(newState, () => {
                if (this.props.onTransitionEnd) {
                  this.props.onTransitionEnd(animationType);
                }
              });
            }, durationMs);
          });
        });
      }
    }
  }

  getRef = ref => {
    const { nodeRef } = this.props;
    this.el = ref;
    if (typeof nodeRef === 'string') {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `You passed a string ref as an Input component's nodeRef prop. ` +
            `String refs are not supported in Materialish components. You may only pass a ` +
            `callback ref or the value returned by createRef(). Your ref has been ignored.`,
          'INVALID_NODE_REF_PROP'
        );
      }
    } else if (typeof nodeRef === 'function') {
      nodeRef(ref);
    } else if (nodeRef && nodeRef.hasOwnProperty('current')) {
      nodeRef.current = ref;
    }
  };
}
