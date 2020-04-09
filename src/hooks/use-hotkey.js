import { useEffect } from 'react';
import { useCurrentRef } from 'core-hooks';

export default function useHotkey(bindings = {}, { useCapture = false } = {}) {
  const bindingsRef = useCurrentRef(bindings);

  useEffect(() => {
    const onKeyDown = e => {
      if (typeof bindingsRef.current[e.key] === 'function') {
        bindingsRef.current[e.key](e);
      }
    };

    window.addEventListener('keydown', onKeyDown, useCapture);

    return () => window.removeEventListener('keydown', onKeyDown, useCapture);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
