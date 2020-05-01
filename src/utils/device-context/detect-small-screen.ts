export default function detectSmallScreen(): boolean {
  return (
    Boolean(window.matchMedia) &&
    window.matchMedia('(max-width: 550px)').matches
  );
}
