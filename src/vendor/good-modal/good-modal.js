import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import noScroll from 'no-scroll';
import classnames from 'classnames';

/*
  Note: although this is a vendor script, these hooks are easily
  copypasta-able into a standalone lib.

  Be mindful of what dependencies you add from the app.
*/
import useOnMount from '../../hooks/use-on-mount';
import useMountTransition from '../../hooks/use-transition';
import useHotkey from '../../hooks/use-hotkey';

// export interface BaseGoodModalProps {
//   children?: JSX.Element[] | JSX.Element | string | number | boolean;
//   className?: string;
//   [Key: string]: any;
// }

// export interface GoodModalProps extends BaseGoodModalProps {
//   active: boolean;
// }

let hasWarned = false;
const modalRootId = 'good-modal-root';

export default function GoodModal({
  children,
  active,
  className = '',
  style = {},
  timeout = 220,
  onMount = () => {},
  onUnmount = () => {},
  onEnter = () => {},
  onLeave = () => {},
  disableScroll = true,

  onPressEsc = () => {},
  onClickOverlay = () => {},
  ...otherProps
}) {
  const modalRoot = useMemo(() => document.getElementById(modalRootId), []);

  const isScrollDisabledRef = useRef();

  useEffect(() => {
    if (modalRoot === null && !hasWarned) {
      hasWarned = true;
      console.warn(
        `Warning: no modal root could be found with the ID #good-modal-root. GoodModal cannot function without a modal root.`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Creating an element to attach to the portal allows us to use the same
  // portal root node for all of the modals in the app.
  const [el] = useState(() => document.createElement('div'));

  const [shouldRender, useActiveClass] = useMountTransition({
    shouldBeMounted: active,
    transitionDurationMs: timeout,
    onEnter,
    onLeave,
  });

  useHotkey({
    Escape: onPressEsc,
  });

  useEffect(
    () => {
      if (shouldRender) {
        if (modalRoot && el) {
          isScrollDisabledRef.current = true;
          noScroll.on();
          modalRoot.appendChild(el);
        }
      } else {
        isScrollDisabledRef.current = false;
        noScroll.off();
        if (modalRoot && modalRoot.contains(el)) {
          modalRoot.removeChild(el);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [shouldRender]
  );

  // On unmount, we ensure that the containing element isn't attached to the DOM.
  // This ensures that if this component is interrupted mid-transition, we don't have
  // anything lingering...
  useOnMount(() => {
    return () => {
      // This ensures that the scroll state is never stuck in a disabled state,
      // even if the modal is removed from the Component tree before it has a chance
      // to completely close.
      if (isScrollDisabledRef.current) {
        noScroll.off();
      }

      if (modalRoot && modalRoot.contains(el)) {
        modalRoot.removeChild(el);
      }
    };
  });

  if (!shouldRender) {
    return null;
  }

  const timeoutMs = `${timeout}ms`;

  return ReactDOM.createPortal(
    <FocusTrap
      focusTrapOptions={{
        fallbackFocus: document.body,
      }}>
      <div>
        <div
          {...otherProps}
          style={{
            ...style,
            '--goodModal-timeoutMs': timeoutMs,
          }}
          className={classnames('goodModal', {
            'goodModal-active': useActiveClass,
            [className]: className,
          })}>
          {children}
        </div>
        <div
          style={{
            '--goodModal-timeoutMs': timeoutMs,
          }}
          className={classnames('goodModal_overlay', {
            'goodModal_overlay-active': useActiveClass,
          })}
          onClick={onClickOverlay}
        />
      </div>
    </FocusTrap>,
    el
  );
}

// export interface ModalTitleProps extends BaseGoodModalProps {}

GoodModal.Title = function ModalTitle({ children, className, ...otherProps }) {
  return (
    <div
      {...otherProps}
      className={`goodModal_title ${className ? className : ''}`}>
      {children}
    </div>
  );
};

// export interface ModalBodyProps extends BaseGoodModalProps {}

GoodModal.Body = function ModalBody({ children, className, ...otherProps }) {
  return (
    <div
      {...otherProps}
      className={`goodModal_body ${className ? className : ''}`}>
      {children}
    </div>
  );
};

// export interface ModalFooterProps extends BaseGoodModalProps {}

GoodModal.Footer = function ModalFooter({
  children,
  className,
  ...otherProps
}) {
  return (
    <div
      {...otherProps}
      className={`goodModal_footer ${className ? className : ''}`}>
      {children}
    </div>
  );
};
