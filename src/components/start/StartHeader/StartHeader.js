import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {MODAL_TYPE_SIGN} from 'ducks/nav';
import {MODE_LOGIN, MODE_REG} from 'components/auth/SignModal/SignModal';

import styles from './StartHeader.sss';


@CSSModules(styles, {allowMultiple: true})
export default class StartHeader extends Component {
  onLogin = () => {
    const {showModal} = this.props;
    showModal(MODAL_TYPE_SIGN, {mode: MODE_LOGIN});
  };

  onReg = () => {
    const {showModal} = this.props;
    showModal(MODAL_TYPE_SIGN, {mode: MODE_REG});
  };

  render() {
    return (
      <div styleName="StartHeader">
        <div styleName="login" onClick={this.onLogin}>Вход</div>
        <div styleName="registration" onClick={this.onReg}>Регистрация</div>
      </div>
    );
  }
}