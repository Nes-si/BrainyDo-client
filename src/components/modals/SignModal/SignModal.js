import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ModalContainer from 'components/elements/ModalContainer/ModalContainer';
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';
import InputControl from 'components/elements/InputControl/InputControl';
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

    if (props.params && props.params.mode)
      this.state.mode = props.params.mode;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter or Esc pressed
    /*if (event.keyCode == 13)
      setTimeout(this.close, 1);
    else*/ if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };

  componentWillReceiveProps(nextProps) {
    const {user, nav} = nextProps;

    if (nav.serverProblemB) {
      this.setState({
        error: null,
        lock: false,
        mode: MODE_SERVER_DOWN
      });
      return;
    }

    const status = user.status;
    if (!status)
      return;

    let mode = this.state.mode;
    if (mode == MODE_REG && status == OK)
      mode = MODE_REG_MAIL;
    else if (mode == MODE_FORGOT && status == OK)
      mode = MODE_FORGOT_MAIL;
    else if (mode == MODE_LOGIN && status == ERROR_UNVERIF)
      mode = MODE_UNVERIF;

    this.props.resetStatus();
    this.setState({
      error: status,
      lock: !status,
      mode
    });
  }

  setMode = mode => {
    this.setState({
      mode,
      error: null,
      password: '',
      passwordConfirm: ''
    });
  };

  onEmailChange = email => {
    this.setState({
      email,
      error: null
    });
  };

  onPasswordChange = password => {
    this.setState({
      password,
      error: null
    });
  };

  onPasswordConfirmChange = passwordConfirm => {
    this.setState({
      passwordConfirm,
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

  onRestore = event => {
    event.preventDefault();

    if (!this.getForgotAvail())
      return false;

    const {restorePassword} = this.props;
    restorePassword(this.state.email);
    this.setState({lock: true});

    return false;
  };

  onResend = () => {
    const {resendVerEmail} = this.props;
    resendVerEmail(this.state.email);
    this.setState({mode: MODE_REG_MAIL});
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

  getForgotAvail() {
    return !this.state.lock &&
      this.state.email;
  }

  close = () => {
    this.props.onClose();
  };

  render() {
    this.elmEmail =
      <div styleName="input-wrapper">
        <InputControl label="Email"
                      autoFocus
                      value={this.state.email}
                      onChange={this.onEmailChange} />
      </div>;

    this.elmPassword =
      <div styleName="input-wrapper">
        <InputControl label="Пароль"
                      inputType="password"
                      value={this.state.password}
                      onChange={this.onPasswordChange} />
      </div>;

    this.elmPasswordConfirm =
      <div styleName="input-wrapper">
        <InputControl label="Пароль (повторно)"
                      inputType="password"
                      value={this.state.passwordConfirm}
                      onChange={this.onPasswordConfirmChange} />
      </div>;

    this.elmCheckbox =
      <div styleName="input-wrapper">
        <CheckboxControl title="Запомнить меня" />
      </div>;

    let content, bottomContent, title;

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
              <ButtonControl color="green"
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
              <ButtonControl type="submit"
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
              <ButtonControl type="submit"
                             value="Вход"
                             onClick={() => this.setMode(MODE_LOGIN)}/>
            </div>
          </div>
        );

        title = (
          <div styleName="title">Регистрация</div>
        );

        break;

      case MODE_REG_MAIL:
        content = (
          <div styleName="form">
            <div styleName="description">
              Мы отправили письмо на ваш email для подтверждения регистрации. Пожалуйста, перейдите по ссылке в нём.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Вернуться ко входу
            </div>
          </div>
        );
        break;

      case MODE_UNVERIF:
        content = (
          <div styleName="form">
            <div styleName="description">
              <p>Похоже, что ваш email ещё не подтверждён.</p>
              <p>Пожалуйста, активируйте его, перейдя по ссылке в нашем письме.</p>
            </div>

            <div styleName="forgot" onClick={this.onResend}>
              Отправить подтверждение ещё раз
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Вернуться ко входу
            </div>
          </div>
        );
        break;

      case MODE_FORGOT:
        content = (
          <form styleName="form" onSubmit={this.onRestore}>
            <div styleName="description">
              Введите ваш email, и мы отправим вам ссылку для сброса пароля.
            </div>
            {this.elmEmail}
            <div styleName="button">
              <ButtonControl color="green"
                             type="submit"
                             disabled={!this.getForgotAvail()}
                             value="Восстановить пароль" />
            </div>

            <div styleName="errors">
              {this.state.error == ERROR_OTHER &&
                <div styleName="error">Неправильный email!</div>
              }
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Вернуться ко входу
            </div>
          </form>
        );
        break;

      case MODE_FORGOT_MAIL:
        content = (
          <div styleName="form">
            <div styleName="description">
              Письмо отправлено. Пожалуйста, проверьте почту.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Вернуться ко входу
            </div>
          </div>
        );
        break;

      case MODE_SERVER_DOWN:
        content = (
          <div styleName="form">
            <div styleName="description">
              Просим прощения, но похоже, что возникли проблемы с нашим сервисом. Пожалуйста, зайдите позднее.
            </div>

            <div styleName="forgot" onClick={() => this.setMode(MODE_LOGIN)}>
              Вернуться ко входу
            </div>
          </div>
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
