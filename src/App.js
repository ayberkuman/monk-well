import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Helmet } from "react-helmet-async";
import { withLocalize } from "react-localize-redux";
import { locale } from "moment";
import "moment/locale/tr";
import Cookies from 'universal-cookie';
import { connect } from "react-redux";

import { Spinner } from 'react-bootstrap';
import global from "./utils/i18n/global.json";

import Layout from "./App/Layout";

import "./assets/App.scss";
import Router from "./App/Router";
import LanguageFiles from "./utils/LanguageFiles";
import is from "is_js";
import { withRouter } from "react-router";
import { handleErrors } from "./utils/helper";
import { login, logout } from "./Auth/authActions";
import { alert, resetAlert, headerTitleSet, pageLoadingSet } from "./App/appActions";
import Alert from "./App/components/Alert";
import API, { headers } from "./utils/API";


class App extends Component {
  state = {
    isLoading: true,
    isAlertActive: false,
  };

  constructor(props) {
    super(props);
    this.props.initialize({
      languages: [
        { name: "English", code: "en" },
        { name: "Turkish", code: "tr" },
      ],
      translation: global,
      options: {
        renderToStaticMarkup,
        renderInnerHtml: true,
        defaultLanguage: "tr",
      },
    });

    locale("tr");
  }

  url = process.env.REACT_APP_URL;

  componentDidMount = async () => {
    window.cookies = new Cookies();
    setTimeout(() => this.setState({ isLoading: true }), 20);
    this.props.setActiveLanguage("tr");

    const localUser = await window.cookies.get('user');
    if (localUser && localUser.isLoggedIn) {
      API.get("Account/WhoAmI", {
        headers: { ...headers, Authorization: `Bearer ${localUser.token}` },
      })
        .then((res) => {
          const { data } = res;
          const user = {
            deviceId: localUser.deviceId,
            fullName: data.user.fullName,
            email: data.user.email,
            token: localUser.token,
          };

          this.props.login(user);
        })
        .catch((err) => handleErrors(err, localUser));
    }

    setTimeout(() => this.setState({ isLoading: false }), 20);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.alert) {
      if (!prevProps.alert.isActive && this.props.alert.isActive) {
        this.setState({ isAlertActive: true }, () => {
          this.handleResetAlert();
        });
      }
    }
  };

  alertTimeout = "";
  handleResetAlert = (now = false) => {
    let timeout = 0;
    if (!now) timeout = parseInt(this.props.alert.timeout);

    clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(
      () =>
        this.setState({ isAlertActive: false }, () =>
          setTimeout(this.props.resetAlert, 300)
        ),
      timeout
    );
  };

  render() {
    const lang = this.props.activeLanguage
      ? this.props.activeLanguage.code
      : this.props.defaultLanguage;

    return this.state.isLoading ? (
      ``
    ) : (
      <div className="App">
        <LanguageFiles />
        <Helmet titleTemplate="%s | Monk Medical" defaultTitle="Monk Medical">
          <html lang="tr" />
          <body is-touch-screen={is.touchDevice()} is-ie={is.ie()} />
        </Helmet>
        <Layout
          lang={lang}
          user={this.props.user}
          translate={this.props.translate}
          headerTitle={this.props.headerTitle}
        >
          {!this.state.isLoading && (
            <Router
              lang={lang}
              url={this.url}
              user={this.props.user}
              translate={this.props.translate}
              activeLanguage={this.props.activeLanguage}
              defaultLanguage={this.props.defaultLanguage}
              alert={this.props.alert}
              showAlert={this.props.showAlert}
              resetAlert={this.props.resetAlert}
              headerTitleSet={this.props.headerTitleSet}
              pageLoadingSet={this.props.pageLoadingSet}
            />
          )}
        </Layout>
        {this.state.isAlertActive && (
          <Alert
            type={this.props.alert.type}
            title={this.props.alert.title}
            content={this.props.alert.content}
            resetAlert={this.handleResetAlert}
          />
        )}
        {this.props.pageLoading && (
          <div className="pageLoading">
            <Spinner animation="border" variant="light" />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    alert: state.app.alert,
    pageLoading: state.app.pageLoading,
    headerTitle: state.app.headerTitle,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user)),
    logout: () => dispatch(logout()),
    showAlert: (alertType, title, content, timeout) =>
      dispatch(alert(alertType, title, content, timeout)),
    resetAlert: () => dispatch(resetAlert()),
    headerTitleSet: (title) => dispatch(headerTitleSet(title)),
    pageLoadingSet: (type) => dispatch(pageLoadingSet(type))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(withRouter(App)));
