import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useIsCalculator() {
  const { pathname } = useLocation();

  const isCalculator = useMemo(() => pathname.includes('calculator'), [
    pathname,
  ]);

  return isCalculator;
}
