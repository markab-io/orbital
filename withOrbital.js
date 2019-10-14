import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  withRouter,
  Redirect
} from "react-router-dom";
import Loadable from "react-loadable";
import { routeListLoggedOut } from "./Routes";
import {
  LoginWithAuth,
  RegisterWithAuth,
  Media,
  Forms,
  Auth,
  Notification,
  Kb,
  Crud
} from "@markab.io/react";
import Loading from "Templates/_shared/Loading/Loading";
import theme from "Theme";
import config from "Config";
import ReactGA from "react-ga";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
const ForgotPassword = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ForgotPassword" */ "./ForgotPassword/ForgotPassword"
    ),
  loading: () => {
    return <Loading />;
  }
});
const ResetPassword = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ResetPassword" */ "./ResetPassword/ResetPassword"
    ),
  loading: err => <Loading err={err} />
});
const Register = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Register" */ "./Register/Register"),
  loading: err => <Loading err={err} />
});
const NotFound = Loadable({
  loader: () =>
    import(/* webpackChunkName: "NotFound" */ "./NotFound/NotFound"),
  loading: err => <Loading err={err} />
});
const Login = Loadable({
  loader: () => import(/* webpackChunkName: "Login" */ "./Login/Login"),
  loading: err => <Loading err={err} />
});
const Profile = Loadable({
  loader: () => import(/* webpackChunkName: "Login" */ "./Profile/Profile"),
  loading: err => <Loading err={err} />
});
const MainWrapper = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "MainWrapper" */ "Templates/Wrappers/MainWrapper"
    ),
  loading: err => <Loading err={err} />
});
const LoginWrapper = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "LoginWrapper" */ "Templates/Wrappers/LoginWrapper"
    ),
  loading: err => <Loading err={err} />
});
const Kernel = Loadable({
  loader: () =>
    import(/* webpackChunkName: "LoginWrapper" */ "./Kernel/Kernel"),
  loading: err => <Loading err={err} />
});
const NotificationPage = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "LoginWrapper" */ "./Notification/Notification"
    ),
  loading: err => <Loading err={err} />
});

const withOrbital = ({
  loginBG,
  registerBG,
  routeList,
  rootStore,
  logo,
  styles,
  gaTrackingCode,
  disableAuth,
  offlineStorage
}) => WrappedComponent => {
  class WithOrbital extends React.Component {
    state = {
      isLoggedIn: false,
      currentUser: {},
      appSettings: {}
    };
    constructor(props) {
      super(props);
      this.onLogout = this.onLogout.bind(this);
    }
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        this.onRouteChanged();
      }
    }
    onRouteChanged() {
      gaTrackingCode && ReactGA.pageview(this.props.location.pathname);
      if (
        !disableAuth &&
        this.props.location.pathname.indexOf("/auth") === -1
      ) {
        rootStore.authDomainStore
          .isAuthenticated()
          .then(res => {
            if (res.status !== 200) {
              this.setState({ isLoggedIn: false });
            } else {
              this.setState({ isLoggedIn: true, currentUser: res.data });
            }
          })
          .catch(err => {
            this.setState({ isLoggedIn: false });
            this.props.history.push("/auth/login");
          });
      }
    }
    componentDidMount() {
      gaTrackingCode && ReactGA.initialize(gaTrackingCode);
      gaTrackingCode && ReactGA.pageview(this.props.location.pathname);
      if (
        !disableAuth &&
        this.props.location.pathname.indexOf("/auth") === -1
      ) {
        rootStore.authDomainStore
          .isAuthenticated()
          .then(res => {
            if (res.status !== 200) {
              this.setState({ isLoggedIn: false });
            } else {
              this.setState({ isLoggedIn: true, currentUser: res.data });
            }
          })
          .catch(err => {
            this.setState({ isLoggedIn: false });
            this.props.history.push("/auth/login");
          });
      }
    }
    onLogout() {
      rootStore.authDomainStore.logout();
    }
    render() {
      const { isLoggedIn } = this.state;
      const { classes } = this.props;
      console.log("WITH ORBITAL CLASSES", classes);
      const currentRouteList = isLoggedIn ? routeList : routeListLoggedOut;
      return (
        <ThemeProvider theme={theme}>
          <Switch>
            <Route
              path="/auth/login"
              render={({ location, history, match }) => {
                return (
                  <LoginWrapper backgroundImage={loginBG}>
                    <LoginWithAuth
                      authUiStore={rootStore.authUiStore}
                      authDomainStore={rootStore.authDomainStore}
                    >
                      <Login
                        onRegister={() => history.push("/auth/register")}
                        onForgotPassword={() =>
                          history.push("/auth/forgot-password")
                        }
                        location={location}
                        history={history}
                        match={match}
                      />
                    </LoginWithAuth>
                  </LoginWrapper>
                );
              }}
            />
            <Route
              path="/auth/register"
              render={({ location, history, match }) => {
                return (
                  <LoginWrapper backgroundImage={registerBG}>
                    <RegisterWithAuth
                      authDomainStore={rootStore.authDomainStore}
                      authUiStore={rootStore.authUiStore}
                    >
                      <Register
                        onLogin={() => history.push("/auth/login")}
                        location={location}
                        history={history}
                        match={match}
                      />
                    </RegisterWithAuth>
                  </LoginWrapper>
                );
              }}
            />
            <Route
              path="/auth/forgot-password"
              render={({ location, history, match }) => {
                return (
                  <LoginWrapper backgroundImage={registerBG}>
                    <Auth authDomainStore={rootStore.authDomainStore}>
                      <ForgotPassword
                        onLogin={() => history.push("/auth/login")}
                        location={location}
                        history={history}
                        match={match}
                      />
                    </Auth>
                  </LoginWrapper>
                );
              }}
            />
            <Route
              path="/auth/reset-password"
              render={({ location, history, match }) => {
                return (
                  <LoginWrapper backgroundImage={registerBG}>
                    <Auth authDomainStore={rootStore.authDomainStore}>
                      <ResetPassword
                        onLogin={() => history.push("/auth/login")}
                        location={location}
                        history={history}
                        match={match}
                      />
                    </Auth>
                  </LoginWrapper>
                );
              }}
            />
            <Route
              path="/profile"
              render={({ location, match, history }) => {
                return (
                  <MainWrapper
                    classes={classes}
                    routeList={currentRouteList}
                    location={location}
                    match={match}
                    history={history}
                    auth={this.state.isLoggedIn}
                    user={this.state.currentUser}
                    logo={logo}
                    hasPadding={true}
                    onLogout={this.onLogout}
                  >
                    <Crud
                      modelName="users"
                      SERVER={config.SERVER}
                      offlineStorage={offlineStorage}
                      notificationDomainStore={
                        rootStore.notificationDomainStore
                      }
                    >
                      <Forms formsDomainStore={rootStore.formsDomainStore}>
                        <Media
                          extension="image/jpg"
                          mediaDomainStore={rootStore.mediaDomainStore}
                        >
                          <Notification
                            notificationDomainStore={
                              rootStore.notificationDomainStore
                            }
                          >
                            <Profile
                              user={this.state.currentUser}
                              formsDomainStore={rootStore.formsDomainStore}
                              location={location}
                              match={match}
                              history={history}
                            />
                          </Notification>
                        </Media>
                      </Forms>
                    </Crud>
                  </MainWrapper>
                );
              }}
            />
            <Route
              path="/notifications"
              render={({ location, match, history }) => {
                return (
                  <MainWrapper
                    classes={classes}
                    routeList={currentRouteList}
                    location={location}
                    match={match}
                    history={history}
                    auth={this.state.isLoggedIn}
                    user={this.state.currentUser}
                    logo={logo}
                    hasPadding={true}
                    onLogout={this.onLogout}
                  >
                    <Crud
                      modelName="notifications"
                      SERVER={config.SERVER}
                      offlineStorage={offlineStorage}
                      notificationDomainStore={
                        rootStore.notificationDomainStore
                      }
                    >
                      <Forms formsDomainStore={rootStore.formsDomainStore}>
                        <Media
                          extension="image/jpg"
                          mediaDomainStore={rootStore.mediaDomainStore}
                        >
                          <Notification
                            notificationDomainStore={
                              rootStore.notificationDomainStore
                            }
                          >
                            <NotificationPage
                              user={this.state.currentUser}
                              formsDomainStore={rootStore.formsDomainStore}
                              location={location}
                              match={match}
                              history={history}
                            />
                          </Notification>
                        </Media>
                      </Forms>
                    </Crud>
                  </MainWrapper>
                );
              }}
            />
            <Route
              path="/kernel"
              render={({ location, match, history }) => {
                return (
                  <MainWrapper
                    classes={classes}
                    routeList={currentRouteList}
                    location={location}
                    match={match}
                    history={history}
                    auth={isLoggedIn}
                    user={this.state.currentUser}
                    logo={logo}
                    hasPadding={true}
                    onLogout={this.onLogout}
                    crudDomainStore={rootStore.crudDomainStore}
                  >
                    <Kb
                      modelName="kernel"
                      kbDomainStore={rootStore.kbDomainStore}
                    >
                      <Crud
                        modelName="kernel"
                        SERVER={config.SERVER}
                        offlineStorage={offlineStorage}
                        notificationDomainStore={
                          rootStore.notificationDomainStore
                        }
                      >
                        <Forms formsDomainStore={rootStore.formsDomainStore}>
                          <Kernel
                            location={location}
                            match={match}
                            history={history}
                          />
                        </Forms>
                      </Crud>
                    </Kb>
                  </MainWrapper>
                );
              }}
            />
            <WrappedComponent
              offlineStorage={offlineStorage}
              user={this.state.currentUser}
              isLoggedIn={isLoggedIn}
              appSettings={this.state.appSettings}
              onLogout={this.onLogout}
              classes={classes}
            />
            <Route
              path="*"
              render={({ location, match, history }) => {
                return (
                  <MainWrapper
                    classes={classes}
                    routeList={currentRouteList}
                    location={location}
                    match={match}
                    history={history}
                    auth={this.state.isLoggedIn}
                    user={this.state.currentUser}
                    logo={logo}
                    hasPadding={true}
                    onLogout={this.onLogout}
                  >
                    <NotFound />
                  </MainWrapper>
                );
              }}
            />
          </Switch>
        </ThemeProvider>
      );
    }
  }
  return compose(
    withRouter,
    withStyles(styles, { defaultTheme: theme })
  )(WithOrbital);
};

export default withOrbital;
