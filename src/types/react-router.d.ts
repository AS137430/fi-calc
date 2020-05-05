declare module 'react-router-dom' {
  import { match } from 'react-router';
  import * as React from 'react';
  import * as H from 'history';

  export {
    generatePath,
    Prompt,
    MemoryRouter,
    RedirectProps,
    Redirect,
    RouteChildrenProps,
    RouteComponentProps,
    RouteProps,
    Route,
    Router,
    StaticRouter,
    SwitchProps,
    Switch,
    match,
    matchPath,
    withRouter,
    RouterChildContext,
    useParams,
    useRouteMatch,
  } from 'react-router';

  export interface BrowserRouterProps {
    basename?: string;
    getUserConfirmation?: (
      message: string,
      callback: (ok: boolean) => void
    ) => void;
    forceRefresh?: boolean;
    keyLength?: number;
  }
  export class BrowserRouter extends React.Component<BrowserRouterProps, any> {}

  export interface HashRouterProps {
    basename?: string;
    getUserConfirmation?: (
      message: string,
      callback: (ok: boolean) => void
    ) => void;
    hashType?: 'slash' | 'noslash' | 'hashbang';
  }
  export class HashRouter extends React.Component<HashRouterProps, any> {}

  export interface LinkProps<S = H.LocationState>
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    component?: React.ComponentType<any>;
    to:
      | H.LocationDescriptor<S>
      | ((location: H.Location<S>) => H.LocationDescriptor<S>);
    replace?: boolean;
    innerRef?: React.Ref<HTMLAnchorElement>;
  }
  export function Link<S = H.LocationState>(
    // TODO: Define this as ...params: Parameters<Link<S>> when only TypeScript >= 3.1 support is needed.
    props: React.PropsWithoutRef<LinkProps<S>> &
      React.RefAttributes<HTMLAnchorElement>
  ): ReturnType<Link<S>>;
  export interface Link<S = H.LocationState>
    extends React.ForwardRefExoticComponent<
        React.PropsWithoutRef<LinkProps<S>> &
          React.RefAttributes<HTMLAnchorElement>
      > {}

  export interface NavLinkProps<S = H.LocationState> extends LinkProps<S> {
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    exact?: boolean;
    strict?: boolean;
    isActive?<Params extends { [K in keyof Params]?: string }>(
      match: match<Params> | null,
      location: H.Location<S>
    ): boolean;
    location?: H.Location<S>;
  }
  export function NavLink<S = H.LocationState>(
    // TODO: Define this as ...params: Parameters<NavLink<S>> when only TypeScript >= 3.1 support is needed.
    props: React.PropsWithoutRef<NavLinkProps<S>> &
      React.RefAttributes<HTMLAnchorElement>
  ): ReturnType<NavLink<S>>;
  export interface NavLink<S = H.LocationState>
    extends React.ForwardRefExoticComponent<
        React.PropsWithoutRef<NavLinkProps<S>> &
          React.RefAttributes<HTMLAnchorElement>
      > {}

  // import * as H from 'history';

  export function useHistory<
    HistoryLocationState = H.LocationState,
    History = H.History<HistoryLocationState>
  >(): History;

  export function useLocation<
    S = H.LocationState,
    Location = H.Location<S>
  >(): Location;
}
