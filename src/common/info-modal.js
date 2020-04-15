import React from 'react';
import IconDone from 'materialish/icon-done';
import Modal from './modal';

const DEFAULT_REC = (
  <>
    We recommend <b>enabling</b> this feature.
  </>
);

export default function InfoModal({
  title,
  recommendation,
  onBeginClose,
  children,
  ...props
}) {
  return (
    <Modal onBeginClose={onBeginClose} {...props}>
      <Modal.Title>{title}</Modal.Title>
      {recommendation && (
        <div className="recommendation">
          <IconDone />
          <div>{recommendation === true ? DEFAULT_REC : recommendation}</div>
        </div>
      )}
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <button
          className="button button-primary"
          type="button"
          onClick={onBeginClose}>
          Okay
        </button>
      </Modal.Footer>
    </Modal>
  );
}
