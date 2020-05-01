import { useState } from 'react';
import detectTouchDevice from '../utils/device-context/detect-touch-device';

export default function useDetectTouchDevice(): boolean {
  const [isTouchDevice] = useState(() => detectTouchDevice());

  return isTouchDevice;
}
