import { useState, useEffect } from 'react';

export default function useIsRendered() {
  const [renderedOnce, setRenderedOnce] = useState(false);

  useEffect(() => {
    setRenderedOnce(true);
  }, []);

  return renderedOnce;
}
