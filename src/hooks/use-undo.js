import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useCurrentRef } from 'core-hooks';

export default function useUndo({ maxUndoCount = 50 } = {}) {
  const [reverseActions, setReverseActions] = useState([]);
  const reverseActionsRef = useCurrentRef(reverseActions);

  function hasUndos() {
    return (
      Array.isArray(reverseActionsRef.current) &&
      reverseActionsRef.current.length
    );
  }

  function undo() {
    if (!hasUndos()) {
      return;
    }

    const nextAction = _.first(reverseActionsRef.current);

    if (typeof nextAction === 'function') {
      nextAction();
    }

    setReverseActions(v => {
      return _.slice(v, 1);
    });
  }

  function addReverseAction(reverseAction) {
    if (typeof reverseAction === 'function') {
      setReverseActions(v => {
        return [reverseAction, ...v].slice(0, maxUndoCount);
      });
    }
  }

  useEffect(() => {
    function handleUndoKey(e) {
      if (e.metaKey && e.key === 'z') {
        undo();
      }
    }

    window.addEventListener('keydown', handleUndoKey, true);

    return () => window.removeEventListener('keydown', handleUndoKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    addReverseAction,
    undo,
    hasUndos,
  };
}
