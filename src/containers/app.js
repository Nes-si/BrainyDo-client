import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import {Helmet} from "react-helmet";
import CSSTransition from 'react-transition-group/CSSTransition';

import {closeModal, MODAL_TYPE_ALERT, MODAL_TYPE_CITY, MODAL_TYPE_SIGN} from 'ducks/nav';
import {login, register, restorePassword, resendVerEmail, resetStatus} from 'ducks/user';

import SiteLoader from 'components/misc/SiteLoader/SiteLoader';
import SignModal from 'components/modals/SignModal/SignModal';
import Header from "containers/Header/Header";
import Footer from "containers/Footer/Footer";
import Dashboard from "containers/Dashboard/Dashboard";
import EventsList from "containers/EventsList/EventsList";
import EventView from "containers/EventView/EventView";
import SettingsView from "containers/SettingsView/SettingsView";
import StartView from "containers/StartView/StartView";
import EventEditView from 'containers/EventEditView/EventEditView';
import AlertModal, {ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';
import CitySelectModal from "components/modals/CitySelectModal/CitySelectModal";

import styles from './app.sss';


const transitions = {
  enter: styles['modal-enter'],
  enterActive: styles['modal-enter-active'],
  exit: styles['modal-exit'],
  exitActive: styles['modal-exit-active']
};


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  lastModal = <span></span>;


  componentDidUpdate(prevProps, prevState, snapshot) {
    const locationChanged = this.props.location !== prevProps.location;
    if (locationChanged) {
      const {closeModal} = this.props.navActions;
      closeModal();
    }
  }

  getAlarm = () => {
    const {nav} = this.props;

    if (nav.serverProblemA && !nav.serverProblemB)
      return (
        <div styleName="alarm">
          Возникла проблема с сервисом. Пожалуйста, подождите...
        </div>
      );
    return null;
  };

  getAlarmModal = () => {
    const params = {
      type: ALERT_TYPE_ALERT,
      title: `Проблема сервиса`,
      description: `Возникли проблемы с нашим сервисом либо с вашим интернет-соединением. Пожалуйста, повторите попытку позже.`,
      confirmLabel: 'Перезагрузить страницу'
    };
    return <AlertModal params={params}
                       onClose={() => window.location = '/'} />;
  };

  getModal = () => {
    const {nav, user} = this.props;
    const {closeModal} = this.props.navActions;

    if (nav.serverProblemB)
      return this.getAlarmModal();

    if (!nav.modalShowing)
      return null;

    const {login, register, restorePassword, resendVerEmail, resetStatus} = this.props.userActions;

    switch (nav.modalType) {
      case MODAL_TYPE_ALERT:
        return <AlertModal onClose={closeModal}
                           params={nav.modalParams} />;

      case MODAL_TYPE_SIGN:
        return <SignModal onClose={closeModal}
                          params={nav.modalParams}
                          user={user}
                          nav={nav}
                          login={login}
                          register={register}
                          restorePassword={restorePassword}
                          resendVerEmail={resendVerEmail}
                          resetStatus={resetStatus} />;

      case MODAL_TYPE_CITY:
        return <CitySelectModal onClose={closeModal}
                                params={nav.modalParams} />;
    }
  };


  render() {
    const {nav, user} = this.props;

    const modal = this.getModal();
    if (modal) {
      this.lastModal = modal;
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    const showModalLoader =
      (user.pending || user.authorized && !nav.initEnded) &&
      !nav.serverProblemB;

    let res = (
      <div styleName="wrapper">
        <Helmet>
          <title>BrainyDo</title>
        </Helmet>

        <header>
          <Header />
        </header>
        <div styleName='container'>
          {user.authorized ?
            <Switch>
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/events-list" component={EventsList}/>
              <Route path="/event-edit" component={EventEditView}/>
              <Route path="/settings" component={SettingsView}/>
              <Route path="/event-:id" component={EventView} />
              <Redirect to="/dashboard" />
            </Switch>
          :
            <Switch>
              <Route path="/" exact component={StartView}/>
              <Route path="/event-:id" component={EventView} />
              <Redirect to="/" />
            </Switch>
          }
          <footer>
            <Footer />
          </footer>
        </div>
        {showModalLoader &&
          <SiteLoader />
        }
        <CSSTransition in={!!modal}
                       timeout={300}
                       classNames={transitions}
                       mountOnEnter={true}
                       unmountOnExit={true}>
          {this.lastModal}
        </CSSTransition>
        {this.getAlarm()}
      </div>
    );

    if (!user.localStorageReady)
      res = <SiteLoader />;

    return res;
  }
}


function mapStateToProps(state) {
  return {
    nav:  state.nav,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:   bindActionCreators({closeModal}, dispatch),
    userActions:  bindActionCreators({login, register, restorePassword, resendVerEmail, resetStatus}, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
