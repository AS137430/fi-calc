import React from 'react';
import './value-input.css';

export default function ValueInput({
  value,
  unit,
  suffix = true,
  className = '',
  ...props
}) {
  return (
    <div
      className={`valueInput ${
        suffix ? 'valueInput-suffixed' : 'valueInput-prefixed'
      }`}>
      <input {...props} className={`input ${className}`} value={value} />
      <div className="valueInput_unit">{unit}</div>
    </div>
  );
}
