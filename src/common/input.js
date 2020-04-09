import React, { useRef } from 'react';
import classnames from 'classnames';
import './input.css';

export default function Input({
  value,
  unit,
  prefix,
  suffix,
  disabled,
  className = '',
  ...props
}) {
  const inputRef = useRef();

  function focusInput() {
    inputRef.current.focus();
  }

  return (
    <div
      className={classnames(`input ${className}`, {
        'input-disabled': disabled,
      })}>
      {Boolean(prefix) && <span className="valueInput_prefix">{prefix}</span>}
      <input
        className="input_innerInput"
        ref={inputRef}
        {...props}
        disabled={disabled}
        value={value}
      />
      {Boolean(suffix) && <span className="valueInput_suffix">{suffix}</span>}
      <div className="input_visuals" onClick={focusInput} />
    </div>
  );
}
