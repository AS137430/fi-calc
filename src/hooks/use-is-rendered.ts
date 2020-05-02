import { useState, useEffect } from 'react';

export default function useIsRendered(): boolean {
  const [renderedOnce, setRenderedOnce] = useState(false);

  useEffect(() => {
    setRenderedOnce(true);
  }, []);

  return renderedOnce;
}
