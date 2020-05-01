import { useState, useEffect } from 'react';
import { useCurrentRef } from 'core-hooks';
import detectSmallScreen from '../utils/device-context/detect-small-screen';

export default function useIsSmallScreen(): boolean {
  const [isSmallScreen, setIsSmallScreen] = useState(() => detectSmallScreen());
  const isSmallScreenRef = useCurrentRef(isSmallScreen);

  useEffect(() => {
    function handler() {
      const isCurrentlySmall = detectSmallScreen();

      if (isCurrentlySmall !== isSmallScreenRef.current) {
        setIsSmallScreen(isCurrentlySmall);
      }
    }

    window.addEventListener('resize', handler, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isSmallScreen;
}
