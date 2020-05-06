import 'react-router-dom';

declare module 'react-router-dom' {
  import * as H from 'history';

  export function useHistory<
    HistoryLocationState = H.LocationState,
    History = H.History<HistoryLocationState>
  >(): History;

  export function useLocation<
    S = H.LocationState,
    Location = H.Location<S>
  >(): Location;
}
