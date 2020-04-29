// On iOS and Android, the native browser behavior is to highlight the nearest
// selectable thing on the webpage when you tap and hold. This is a problem
// for the interaction where you can tap and hold the chart to view details.
// What this code does is allow you to enable and disable selection for all elements
// on the page. They are disabled when the touch event starts, and re-enabled once
// it ends.

const css = `* {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}`;

const head = document.head || document.getElementsByTagName('head')[0];
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));

export function disableUserSelect() {
  head.appendChild(style);
}

export function enableUserSelect() {
  head.removeChild(style);
}
