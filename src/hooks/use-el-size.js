import { useState, useEffect, useRef } from 'react';

export default function useElSize(el) {
  const elRef = useRef();
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize() {
    const bb = hasEl() ? elRef.current.getBoundingClientRect() : null;

    return {
      width: bb ? bb.width : undefined,
      height: bb ? bb.height : undefined,
    };
  }

  useEffect(
    () => {
      if (el) {
        elRef.current = el ? el.current : null;
        setWindowSize(getSize());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [el]
  );

  function hasEl() {
    return typeof elRef.current === 'object';
  }

  useEffect(() => {
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}
