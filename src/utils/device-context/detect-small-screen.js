export default function detectSmallScreen() {
  return window.matchMedia && window.matchMedia('(max-width: 550px)').matches;
}
