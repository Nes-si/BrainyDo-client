import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {NavLink, withRouter} from "react-router-dom";

import {showModal, MODAL_TYPE_SIGN} from "ducks/nav";
import {logout} from "ducks/user";
import {MODE_LOGIN, MODE_REG} from "components/modals/SignModal/SignModal";

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

    let menu = (
      <div styleName="menu">
        <div styleName="item" onClick={this.onLogin}>Вход</div>
        <div styleName="item" onClick={this.onReg}>Регистрация</div>
      </div>
    );

    if (authorized)
      menu = (
        <div styleName="menu">
          <NavLink styleName="item"
                   activeClassName={styles.itemActive}
                   to="/dashboard">
            Домой
          </NavLink>
          <NavLink styleName="item"
                   activeClassName={styles.itemActive}
                   to="/events-list">
            Найти события
          </NavLink>
          <NavLink styleName="item"
                   activeClassName={styles.itemActive}
                   to="/settings">
            Настройки
          </NavLink>
          <div styleName="item" onClick={this.onLogout}>Выход</div>
        </div>
      );

    return (
      <div styleName="Header">
        <div styleName="logo">
          <img src={require("assets/images/logo.png")} />
        </div>
        {menu}
        <div styleName="location">
          Ростов-на-Дону
        </div>
      </div>
    );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
