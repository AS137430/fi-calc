import { useState, useEffect, useRef } from 'react';
import { useCurrentRef } from 'core-hooks';
import useIsRendered from './use-is-rendered';

const RENDER_TIMEOUT = 35;

export default function useTransition({
  shouldBeMounted,
  transitionDurationMs,
  onEnter,
  onLeave,

  onEnteringTimeout = RENDER_TIMEOUT,
}) {
  let enterTimeoutToUse;
  if (typeof onEnteringTimeout === 'number') {
    enterTimeoutToUse = onEnteringTimeout;
  } else {
    enterTimeoutToUse = Boolean(onEnteringTimeout) ? RENDER_TIMEOUT : 0;
  }

  const optionsRef = useCurrentRef({
    onEnter,
    onLeave,
  });

  // We track all of our state on one object. This is to prevent strange issues
  // that can occur when they update as independent state values.
  // I believe that the strange issues occur due to this component's usage of
  // timeouts.
  const defaultState = {
    shouldBeMounted,
    shouldRender: shouldBeMounted,
    useActiveClass: shouldBeMounted,
  };

  const [transitionState, updateTransitionState] = useState(defaultState);

  // This is just a li'l utility to make it easier to update our state.
  // This exists because `useState` doesn't merge the new with the old.
  function mergeNewState(newState) {
    return prevState => {
      return {
        ...prevState,
        ...newState,
      };
    };
  }

  // We need to keep track of whether we have been rendered or not. Otherwise,
  // this this will try and unmount something that was never mounted the first time
  // the hook is called.
  const isRendered = useIsRendered();

  // This is the time when the latest enter transition began. We use it to
  // determine how much time would be necessary to transition out if the enter
  // transition is interrupted by a `shouldBeMounted: false`
  const startTimeMs = useRef();

  // Timeout references
  const onCallEnterTimeoutRef = useRef();
  const onEnterTimeoutRef = useRef();
  const onExitTimeoutRef = useRef();

  useEffect(() => {
    // When this component unmounts, we clear out all of the timers
    return () => {
      clearTimeout(onCallEnterTimeoutRef.current);
      clearTimeout(onEnterTimeoutRef.current);
      clearTimeout(onExitTimeoutRef.current);
    };
  }, []);

  // Subscribe to changes in the passed-in `shouldBeMounted` value.
  // Again, you may be wondering: why not use it directly? The reason is that I was running
  // into (hard-to-replicate) bugs where the state reconciliation was weird in the setTimeout
  // callbacks. Keeping all relevant state on a single object ensures that things don't
  // get in a whacky state.
  useEffect(
    () => {
      updateTransitionState(
        mergeNewState({
          shouldBeMounted,
        })
      );
    },
    [shouldBeMounted]
  );

  useEffect(
    () => {
      if (isRendered && !transitionState.shouldBeMounted) {
        clearTimeout(onEnterTimeoutRef.current);
        clearTimeout(onCallEnterTimeoutRef.current);

        let closeDuration = transitionDurationMs;

        if (startTimeMs.current !== null) {
          const endTimeMs = new Date().getTime();
          const elapsedTime = endTimeMs - startTimeMs.current;
          closeDuration = elapsedTime;
        }

        updateTransitionState(
          mergeNewState({
            useActiveClass: false,
          })
        );

        onExitTimeoutRef.current = setTimeout(() => {
          updateTransitionState(
            mergeNewState({
              shouldRender: false,
            })
          );

          if (typeof optionsRef.current.onLeave === 'function') {
            optionsRef.current.onLeave();
          }
        }, closeDuration);
      } else if (transitionState.shouldBeMounted) {
        clearTimeout(onExitTimeoutRef.current);

        if (typeof enterTimeoutToUse === 'number' && enterTimeoutToUse > 0) {
          updateTransitionState(
            mergeNewState({
              shouldRender: true,
            })
          );

          onEnterTimeoutRef.current = setTimeout(() => {
            updateTransitionState(
              mergeNewState({
                useActiveClass: true,
              })
            );

            startTimeMs.current = new Date().getTime();
          }, enterTimeoutToUse);
        } else {
          updateTransitionState(
            mergeNewState({
              shouldRender: true,
              useActiveClass: true,
            })
          );
        }

        onCallEnterTimeoutRef.current = setTimeout(() => {
          // TODO: Actually call this onEnter callback
          if (typeof optionsRef.current.onEnter === 'function') {
            optionsRef.current.onEnter();
          }
          startTimeMs.current = null;
        }, transitionDurationMs);
      }
    },
    // Heads up! It's important that we track our transitionState's shouldBeMounted, and not the
    // one that the user passes in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transitionState.shouldBeMounted]
  );

  return [transitionState.shouldRender, transitionState.useActiveClass];
}
