import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import CSSTransition from 'react-transition-group/CSSTransition';

import SiteLoader from 'components/misc/SiteLoader/SiteLoader';
import AlertModal, {ALERT_TYPE_ALERT} from 'components/misc/AlertModal/AlertModal';
import SignModal from 'components/auth/SignModal/SignModal';
import {closeAlert, closeModal, MODAL_TYPE_SIGN} from 'ducks/nav';
import {login, register, restorePassword, resendVerEmail, resetStatus} from 'ducks/user';

import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  lastModal = <span></span>;


  render() {
    const {nav, user, serverStatus} = this.props;
    const {closeAlert, closeModal} = this.props.navActions;
    const {login, register, restorePassword, resendVerEmail, resetStatus} = this.props.userActions;

    const getAlarm = () => {
      if (serverStatus.problemA && !serverStatus.problemB)
        return (
          <div styleName="alarm">
            Возникла проблема с нашим сервисом. Пожалуйста, подождите...
          </div>
        );
      return null;
    };

    const getModal = () => {
      if (nav.alertShowing)
        return <AlertModal params={nav.alertParams} onClose={closeAlert}/>;

      if (!nav.modalShowing) {
        if (!serverStatus.problemB || !nav.initEnded)
          return null;

        const params = {
          type: ALERT_TYPE_ALERT,
          title: `Проблема сервиса`,
          description: `Возникли проблемы с нашим сервисом либо с вашим интернет-соединением. Пожалуйста, повторите попытку позже.`,
          confirmLabel: 'Перезагрузить страницу'
        };
        return <AlertModal params={params}
                           onClose={() => window.location = '/'}/>;
      }

      switch (nav.modalType) {
        case MODAL_TYPE_SIGN:
          return <SignModal params={nav.modalParams}
                            login={login}
                            register={register}
                            restorePassword={restorePassword}
                            resendVerEmail={resendVerEmail}
                            resetStatus={resetStatus}
                            onClose={closeModal}/>;
      }
    };

    //костыльно чот, блин
    const trans = {
      enter: styles['modal-enter'],
      enterActive: styles['modal-enter-active'],
      exit: styles['modal-exit'],
      exitActive: styles['modal-exit-active']
    };

    const modal = getModal();
    if (modal)
      this.lastModal = modal;

    const showModalLoader =
      (user.pending || user.authorized && !nav.initEnded) &&
      !serverStatus.problemB;

    let res = (
      <div styleName="wrapper">
        {this.props.children}
        {showModalLoader &&
          <SiteLoader />
        }
        <CSSTransition in={!!modal}
                       timeout={300}
                       classNames={trans}
                       mountOnEnter={true}
                       unmountOnExit={true}>
          {this.lastModal}
        </CSSTransition>
        {getAlarm()}
      </div>
    );

    if (!user.localStorageReady)
      res = <SiteLoader />;

    return res;
  }
}


function mapStateToProps(state) {
  return {
    nav:          state.nav,
    serverStatus: state.serverStatus,
    user:         state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:   bindActionCreators({closeAlert, closeModal}, dispatch),
    userActions:  bindActionCreators({login, register, restorePassword, resendVerEmail, resetStatus}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
