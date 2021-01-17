import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import NotFound from "../NotFound/NotFound";

import {
  globalRoutes,
  authRoutes,
  guestRoutes,
} from "./routes";

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

const PrivateRoute = ({ component, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return rest.user.isLoggedIn ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: routeProps.location },
            }}
          />
        );
      }}
    />
  );
};

const GuestRoute = ({ component, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return !rest.user.isLoggedIn ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: routeProps.location },
            }}
          />
        );
      }}
    />
  );
};

class Router extends Component {
  state = {
    prevLocation: "",
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.location !== this.props.location)
      this.setState({ prevLocation: prevProps.location });
  };

  render() {
    const { lang } = this.props;
    const mutualProps = {
      user: this.props.user,
      lang,
      translate: this.props.translate,
      activeLanguage: this.props.activeLanguage,
      defaultLanguage: this.props.defaultLanguage,
      cart: this.props.cart,
      prevLocation: this.state.prevLocation,
      toggleAuthModal: this.props.toggleAuthModal,
      url: this.props.url,
      alert: this.props.alert,
      showAlert: this.props.showAlert,
      resetAlert: this.props.resetAlert,
    };
    const globalRoutesComponents = Object.keys(globalRoutes).map((key) => {
      return (
        <PropsRoute
          key={globalRoutes[key].id}
          exact={globalRoutes[key].exact}
          path={globalRoutes[key].links[lang]}
          component={globalRoutes[key].property}
          {...mutualProps}
        />
      );
    });

    const authRoutesComponents =
      Object.keys(authRoutes).length &&
      Object.keys(authRoutes).map((key) => {
        return (
          <PrivateRoute
            key={authRoutes[key].id}
            path={authRoutes[key].links[lang]}
            exact={authRoutes[key].exact}
            component={authRoutes[key].property}
            redirectTo={guestRoutes.login.links[lang]}
            {...mutualProps}
          />
        );
      });

    const guestRoutesComponents =
      Object.keys(guestRoutes).length &&
      Object.keys(guestRoutes).map((key) => {
        return (
          <GuestRoute
            key={guestRoutes[key].id}
            path={guestRoutes[key].links[lang]}
            exact={guestRoutes[key].exact}
            component={guestRoutes[key].property}
            redirectTo={authRoutes.home.links[lang]}
            {...mutualProps}
          />
        );
      });
    return (
      <Switch>
        {globalRoutesComponents}
        {guestRoutesComponents}
        {authRoutesComponents}
        <Route render={() => <NotFound />} />
      </Switch>
    );
  }
}

export default withRouter(Router);
