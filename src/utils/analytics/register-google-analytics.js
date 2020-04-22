import ReactGA from 'react-ga';

const trackingId = 'UA-164261905-1';

export default function registerGoogleAnalytics() {
  ReactGA.initialize(trackingId);
}
