import React from 'react';
import Modal from './modal';

export default function InfoModal({ title, onBeginClose, children, ...props }) {
  return (
    <Modal onBeginClose={onBeginClose} {...props}>
      <Modal.Title>{title}</Modal.Title>
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
