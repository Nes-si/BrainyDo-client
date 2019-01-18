import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Link} from "react-router-dom";

import {showModal, MODAL_TYPE_SIGN} from "ducks/nav";
import {logout} from "ducks/user";
import {MODE_LOGIN, MODE_REG} from "components/auth/SignModal/SignModal";

import styles from './Header.sss';


@CSSModules(styles, {allowMultiple: true})
class Header extends Component {
  onLogin = () => {
    const {showModal} = this.props.navActions;
    showModal(MODAL_TYPE_SIGN, {mode: MODE_LOGIN});
  };

  onReg = () => {
    const {showModal} = this.props.navActions;
    showModal(MODAL_TYPE_SIGN, {mode: MODE_REG});
  };

  onLogout = () => {
    this.props.userActions.logout();
  };

  render() {
    const {authorized} = this.props.user;

    let content = (
      <div styleName="Header">
        <div styleName="point" onClick={this.onLogin}>Вход</div>
        <div styleName="point" onClick={this.onReg}>Регистрация</div>
      </div>
    );

    if (authorized)
      content = (
        <div styleName="Header">
          <Link styleName="point" to="/dashboard">Домой</Link>
          <Link styleName="point" to="/events-list">Найти события</Link>
          <Link styleName="point" to="/settings">Настройки</Link>
          <div styleName="point" onClick={this.onLogout}>Выход</div>
        </div>
      );

    return content;
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
    navActions:   bindActionCreators({showModal}, dispatch),
    userActions:  bindActionCreators({logout}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
