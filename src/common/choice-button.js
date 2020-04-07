import React from 'react';
import './choice-button.css';

export default function ChoiceButton(props) {
  const { className = '', children, nodeRef, onClick, ...rest } = props;

  return (
    <div className={`choiceButton ${className}`} onClick={onClick}>
      <input
        type="radio"
        className="choiceButton_input"
        ref={nodeRef}
        {...rest}
      />
      <div className="choiceButton_chip">{children}</div>
      <div className="choiceButton_focus" />
    </div>
  );
}

ChoiceButton.ChoiceButtonGroup = function ChoiceButtonGroup({ children }) {
  return <div className="choiceButton_group">{children}</div>;
};
