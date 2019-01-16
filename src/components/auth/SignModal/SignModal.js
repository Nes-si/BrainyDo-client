import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import ModalContainer from 'components/elements/ModalContainer/ModalContainer';
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';
import {ERROR_USER_EXISTS, ERROR_WRONG_PASS, ERROR_UNVERIF, ERROR_OTHER, OK} from 'ducks/user';

import styles from './SignModal.sss';


export const MODE_LOGIN       = 'login';
export const MODE_REG         = 'register';
export const MODE_REG_MAIL    = 'register_mail';
export const MODE_UNVERIF     = 'unverified';
export const MODE_FORGOT      = 'forgot';
export const MODE_FORGOT_MAIL = 'forgot_mail';
export const MODE_SERVER_DOWN = 'server_down';


@CSSModules(styles, {allowMultiple: true})
export default class SignModal extends Component {
  state = {
    mode: MODE_LOGIN,
    email: ``,
    password: ``,
    passwordConfirm: ``,
    error: null,
    lock: false
  };

  elmEmail;
  elmPassword;
  elmPasswordConfirm;


  constructor(props) {
    super(props);

    if (props.mode)
      this.state.mode = props.mode;
  }

  setMode = mode => {
    this.setState({mode});
  };

  onEmailChange = event => {
    this.setState({
      email: event.target.value,
      error: null
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
      error: null
    });
  };

  onPasswordConfirmChange = event => {
    this.setState({
      passwordConfirm: event.target.value,
      error: null
    });
  };

  onLogin = event => {
    event.preventDefault();

    if (!this.getLoginAvail())
      return false;

    const {login} = this.props;
    login(this.state.email, this.state.password);
    this.setState({lock: true});

    return false;
  };

  onReg = event => {
    event.preventDefault();

    if (!this.getRegAvail())
      return false;

    const {register} = this.props;
    register(this.state.email, this.state.password);
    this.setState({lock: true});

    return false;
  };

  getLoginAvail() {
    return !this.state.lock &&
      this.state.email &&
      this.state.password;
  }

  getRegAvail() {
    return !this.state.lock &&
      this.state.email &&
      this.state.password &&
      this.state.password == this.state.passwordConfirm;
  }

  close = () => {
    const {callback} = this.props.params;
    this.props.onClose();
    if (callback)
      callback();
  };

  render() {
    this.elmEmail =
      <div styleName="input-wrapper">
        Email
        <input styleName="input"
               type="text"
               autoFocus
               value={this.state.email}
               onChange={this.onEmailChange} />
      </div>;

    this.elmPassword =
      <div styleName="input-wrapper">
        Пароль
        <input styleName="input"
               type="password"
               value={this.state.password}
               onChange={this.onPasswordChange} />
      </div>;

    this.elmPasswordConfirm =
      <div styleName="input-wrapper">
        Пароль (повторно)
        <input styleName="input"
               type="password"
               value={this.state.passwordConfirm}
               onChange={this.onPasswordConfirmChange} />
      </div>;

    this.elmCheckbox =
      <div styleName="input-wrapper">
        <CheckboxControl title="Запомнить меня" />
      </div>;

    let content, bottomContent, title, icon;

    switch (this.state.mode) {
      case MODE_LOGIN:
        content = (
          <form styleName="form" onSubmit={this.onLogin}>
            {this.elmEmail}
            {this.elmPassword}
            <div styleName="checkbox-wrapper">
              {this.elmCheckbox}
              <div styleName="forgot" onClick={() => this.setMode(MODE_FORGOT)}>
                Забыли пароль?
              </div>
            </div>

            <div styleName="button">
              <ButtonControl color="purple"
                             type="submit"
                             disabled={!this.getLoginAvail()}
                             value="Войти" />
            </div>

            <div styleName="errors">
              {this.state.error == ERROR_WRONG_PASS &&
                <div styleName="error">Неправильный email или пароль!</div>
              }
            </div>
          </form>
        );

        bottomContent = (
          <div styleName="bottom-content">
            Нет аккаунта? Нет проблем!
            <div styleName="button-wrapper">
              <ButtonControl color="black"
                             type="submit"
                             value="Регистрация"
                             onClick={() => this.setMode(MODE_REG)}/>
            </div>
          </div>
        );

        title = (
          <div styleName="title">Вход</div>
        );

        break;


      case MODE_REG:
        content = (
          <form styleName="form" onSubmit={this.onReg}>
            {this.elmEmail}
            {this.elmPassword}
            {this.elmPasswordConfirm}

            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getRegAvail()}
                             value="Зарегистрироваться" />
            </div>

            <div styleName="errors">
              {this.state.error == ERROR_USER_EXISTS &&
                <div styleName="error">Этот email уже используется!</div>
              }
            </div>
          </form>
        );

        bottomContent = (
          <div styleName="bottom-content">
            <div styleName="reg-info">
              Нажимая «Зарегистрироваться», вы подтверждаете согласие с нашими<br/>
              <a href="#">«Правилами использования»</a> и <a href="#">«Политикой неразглашения»</a>.
            </div>
            <div styleName="reg-text">
              Уже есть аккаунт?
            </div>
            <div styleName="button-wrapper">
              <ButtonControl color="black"
                             type="submit"
                             value="Вход"
                             onClick={() => this.setMode(MODE_LOGIN)}/>
            </div>
          </div>
        );

        title = (
          <div styleName="title">Регистрация</div>
        );

        break;
    }

    return (
      <ModalContainer onClose={this.close}>
        <div styleName="Sign">
          {title}
          {content}
          {bottomContent}
        </div>
      </ModalContainer>
    );
  }
}
