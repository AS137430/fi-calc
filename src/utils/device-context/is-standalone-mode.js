//
// This module returns `true` when the user is running the app in standalone mode (as a PWA).
//
// For more, see:
// https://developers.google.com/web/fundamentals/app-install-banners/#detect-mode
//

const safariStandalone =
  window.navigator && window.navigator.standalone === true;
const chromeStandalone =
  window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

export default safariStandalone || chromeStandalone;
