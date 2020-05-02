// Returns true when a device's primary input method is touch
export default function detectTouchDevice(): boolean {
  return (
    Boolean(window.matchMedia) && window.matchMedia('(hover: none)').matches
  );
}
