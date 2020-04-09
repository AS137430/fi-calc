import React from 'react';
import GoodModal from '../vendor/good-modal';
import { useCurrentRef } from 'core-hooks';

export default function Modal({ onBeginClose, children, ...props }) {
  const dismissible = typeof onBeginClose === 'function';
  const dismissibleRef = useCurrentRef(dismissible);
  const onBeginCloseRef = useCurrentRef(onBeginClose);

  function onClose(e) {
    if (
      dismissibleRef.current &&
      typeof onBeginCloseRef.current === 'function'
    ) {
      onBeginCloseRef.current();
    }
  }

  return (
    <GoodModal
      timeout={300}
      onClickOverlay={onClose}
      onPressEsc={onClose}
      {...props}>
      {children}
    </GoodModal>
  );
}

Modal.Title = GoodModal.Title;
Modal.Body = GoodModal.Body;
Modal.Footer = GoodModal.Footer;
