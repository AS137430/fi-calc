import React from 'react';
import IconHelp from 'materialish/icon-help';
import './config-section.css';

export default function ConfigSection({
  title,
  children,
  onHelpClick,
  onHelpTitle = 'Learn more',
}) {
  return (
    <div className="configSection">
      {typeof title === 'string' && (
        <div className="configSection_title">
          {title}
          {typeof onHelpClick === 'function' && (
            <button
              title={onHelpTitle}
              className="helpIcon"
              type="button"
              onClick={() => onHelpClick()}>
              <IconHelp />
            </button>
          )}
        </div>
      )}
      <div className="configSection_body">{children}</div>
    </div>
  );
}
