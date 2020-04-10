import React from 'react';
import './config-section.css';

export default function ConfigSection({ title, children }) {
  return (
    <div className="configSection">
      {typeof title === 'string' && (
        <div className="configSection_title">{title}</div>
      )}
      <div className="configSection_body">{children}</div>
    </div>
  );
}
