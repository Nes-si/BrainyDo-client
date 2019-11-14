import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Parse} from "parse";

import 'flatpickr/dist/flatpickr.min.css';
import {Russian} from "flatpickr/dist/l10n/ru";
import Flatpickr from 'react-flatpickr';

import {MODAL_TYPE_CITY, showModal} from "ducks/nav";
import {update, updateEmail, updatePassword, resendVerEmail, ERROR_USER_EXISTS, ERROR_OTHER} from 'ducks/user';
import {convertDataUnits, BYTES, M_BYTES} from 'utils/common';
import {checkEmail, filterSpecials, getTextDate} from 'utils/strings';
import {checkPassword} from 'utils/data';
import {FILE_SIZE_MAX} from "ConnectConstants";

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import RadioControl from "components/elements/RadioControl/RadioControl";
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './SettingsView.sss';


const CHG_DATA      = `CHG_DATA`;
const CHG_EMAIL     = `CHG_EMAIL`;
const CHG_PASSWORD  = `CHG_PASSWORD`;


@CSSModules(styles, {allowMultiple: true})
class SettingsView extends Component {
  state = {
    nameFirst: '',
    nameLast: '',
    sex: ``,
    birthdate: null,
    dirtyData: false,
    errorData: null,
    successData: ``,

    image: null,
    imageLoading: false,
    imageError: null,

    email: '',
    emailNew: '',
    dirtyEmail: false,
    errorEmail: null,
    successEmailState: false,

    passwordOld: ``,
    password: '',
    passwordConfirm: '',
    dirtyPassword: false,
    errorPassword: null,
    successPassword: ``
  };
  userData = null;
  lastChange = null;

  now = new Date();


  constructor(props) {
    super(props);

    const {user} = props;

    this.userData = user.userData;

    this.state.nameFirst  = this.userData.nameFirst;
    this.state.nameLast   = this.userData.nameLast;
    this.state.sex        = this.userData.sex;
    this.state.birthdate  = this.userData.birthdate;
    this.state.image      = this.userData.image;
    this.state.email      = this.userData.email;

    if (this.userData.emailNew) {
      this.state.emailNew = this.userData.emailNew;
      this.state.successEmailState = true;
    } else {
      this.state.emailNew = this.userData.email;
    }
  }

  componentWillReceiveProps(nextProps) {
    const {user} = nextProps;

    switch (this.lastChange) {
      case CHG_DATA:
        this.setState({successData: `Данные были успешно изменены!`});
        setTimeout(() => this.setState({successData: ``}), 2500);
        break;

      case CHG_EMAIL:
        let errorEmail = null;
        switch (user.error) {
          case ERROR_USER_EXISTS: errorEmail = `Пользователь с таким email'ом уже существует!`; break;
          case ERROR_OTHER:       errorEmail = `Неизвестная ошибка!`;                           break;
        }

        if (errorEmail) {
          this.setState({
            emailNew: this.userData.emailNew ? this.userData.emailNew : this.userData.email,
            errorEmail
          });
        } else {
          this.setState({successEmailState: true});
        }

        break;

      case CHG_PASSWORD:
        this.setState({successPassword: `Пароль был успешно изменён!`});
        setTimeout(() => this.setState({successPassword: ``}), 2500);
        break;
    }
  }

  onSaveData = e => {
    e.preventDefault();

    if (!this.state.dirtyData || this.state.errorData)
      return;

    if (this.validateData()) {
      this.setState({dirtyData: false});
      this.lastChange = CHG_DATA;

      this.userData.nameFirst = this.state.nameFirst;
      this.userData.nameLast  = this.state.nameLast;
      this.userData.sex       = this.state.sex;
      this.userData.birthdate = this.state.birthdate;
      this.userData.image     = this.state.image;

      const {update} = this.props.userActions;
      update(this.userData);
    }
  };

  onSaveEmail = e => {
    e.preventDefault();

    if (!this.state.dirtyEmail || this.state.errorEmail)
      return;

    if (this.validateEmail()) {
      this.setState({dirtyEmail: false});
      this.lastChange = CHG_EMAIL;

      const {updateEmail} = this.props.userActions;
      updateEmail(this.state.emailNew);
    }
  };

  onSavePassword = e => {
    e.preventDefault();

    if (!this.state.dirtyPassword || this.state.errorPassword)
      return;

    this.validatePassword()
      .then(() => {
        const {updatePassword} = this.props.userActions;
        updatePassword(this.state.password);
        this.lastChange = CHG_PASSWORD;

        this.setState({passwordOld: ``, password: '', passwordConfirm: '', dirtyPassword: false});
      })
      .catch(() => {});
  };

  onImageUpload = async event => {
    const file = event.target.files[0];
    if (!file)
      return;

    if (file.size > FILE_SIZE_MAX) {
      const max = convertDataUnits(FILE_SIZE_MAX, BYTES, M_BYTES);
      const size = convertDataUnits(size, BYTES, M_BYTES);
      this.setState({imageError: `Размер файла (${size} ${M_BYTES}) превышает допустимый (${max} ${M_BYTES})!`});
      return;
    }

    this.setState({imageLoading: true});

    const parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    await parseFile.save();

    this.setState({imageLoading: false, image: parseFile, dirtyData: true});
  };

  validateData() {
    return true;
  }

  validateEmail() {
    if (!checkEmail(this.state.emailNew)) {
      this.setState({errorEmail: `Неверный email!`});
      return false;
    }

    return true;
  }

  validatePassword() {
    if (this.state.password != this.state.passwordConfirm) {
      this.setState({errorPassword: `Пароли не совпадают!`});
      return Promise.reject();
    }

    return checkPassword(this.state.passwordOld)
      .catch(e => {
        this.setState({errorPassword: `Текущий пароль неверен!`});
        return Promise.reject();
      });
  }

  onChangeNameFirst = nameFirst => {
    this.setState({nameFirst, dirtyData: true, errorData: null});
  };

  onChangeNameLast = nameLast => {
    this.setState({nameLast, dirtyData: true, errorData: null});
  };

  onChangeSex = sex => {
    this.setState({sex, dirtyData: true});
  };

  onChangeBirthdate = _date => {
    const birthdate = _date[0];
    this.setState({birthdate, dirtyData: true});
  };

  onChangeLocation = () => {
    const {showModal} = this.props.navActions;
    showModal(MODAL_TYPE_CITY, {callback: loc => {
        this.userData.location = loc;
        this.props.userActions.update(this.userData);
      }});
  };

  onChangeEmail = emailNew => {
    this.setState({
      emailNew,
      dirtyEmail: emailNew != this.userData.emailNew,
      errorEmail: null
    });
  };

  onChangePasswordOld = passwordOld => {
    const dirtyPassword = !!passwordOld || !!this.state.password || !!this.state.passwordConfirm;
    this.setState({passwordOld, dirtyPassword, errorPassword: null});
  };

  onChangePassword = password => {
    const dirtyPassword = !!password || !!this.state.passwordOld || !!this.state.passwordConfirm;
    this.setState({password, dirtyPassword, errorPassword: null});
  };

  onChangePasswordConfirm = passwordConfirm => {
    const dirtyPassword = !!passwordConfirm || !!this.state.passwordOld || !!this.state.password;
    this.setState({passwordConfirm, dirtyPassword, errorPassword: null});
  };

  resendVerification = e => {
    const {resendVerEmail} = this.props.userActions;
    resendVerEmail();
  };


  render() {
    const {location} = this.props.user.userData;

    const imageSrc = this.state.image ? this.state.image.url() : require('assets/images/default-avatar.jpg');

    return (
      <div styleName="SettingsView">
        <Helmet>
          <title>Настройки — BrainyDo</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Настройки</div>
        </div>

        <div styleName='content'>
          <form styleName="section" onSubmit={this.onSaveData}>
            <div styleName="section-header">Личные данные</div>

            <div styleName="section-columns">
              <div styleName='image-container'>
                <div styleName="image"
                     style={{backgroundImage: `url(${imageSrc}`}} />
                <div styleName="upload-button">
                  Загрузить изображение
                  <input styleName="upload-hidden"
                         type="file"
                         accept="image/jpeg,image/png,image/gif"
                         onChange={this.onImageUpload}/>
                </div>
                {this.state.imageLoading &&
                  <div styleName="image-loading">
                    <LoaderComponent/>
                  </div>
                }
              </div>

              <div styleName="text">
                <div styleName="field inline">
                  <div styleName="field-title">Имя:</div>
                  <div styleName="input-wrapper">
                    <InputControl value={this.state.nameFirst}
                                  onChange={this.onChangeNameFirst} />
                  </div>
                </div>
                <div styleName="field inline">
                  <div styleName="field-title">Фамилия:</div>
                  <div styleName="input-wrapper">
                    <InputControl value={this.state.nameLast}
                                  onChange={this.onChangeNameLast} />
                  </div>
                </div>
                <div styleName="field inline">
                  <div styleName="field-title">Пол:</div>
                  <div styleName="radio-wrapper">
                    <RadioControl name="sex"
                                  data="male"
                                  value={this.state.sex}
                                  label="мужской"
                                  onChange={this.onChangeSex} />
                  </div>
                  <div styleName="radio-wrapper">
                    <RadioControl name="sex"
                                  data="female"
                                  value={this.state.sex}
                                  label="женский"
                                  onChange={this.onChangeSex} />
                  </div>
                </div>
                <div styleName="field inline">
                  <div styleName="field-title">Дата рождения:</div>
                  <div styleName="date-picker">
                    <Flatpickr value={this.state.birthdate}
                               options={{
                                 locale: Russian,
                                 formatDate: getTextDate,
                                 maxDate: this.now
                               }}
                               onChange={this.onChangeBirthdate} />
                  </div>
                </div>
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <ButtonControl type="submit"
                             disabled={!this.state.dirtyData || this.state.errorData}
                             value="Обновить личные данные"/>
            </div>
            <div styleName="field-success">
              {this.state.successData}
            </div>
            <div styleName="field-error">
              {this.state.errorData}
            </div>
          </form>

          <div styleName="section">
            <div styleName="section-header">Населённый пункт</div>
            <div styleName="input-wrapper">
              <InputControl value={location ? location.main : "Не выбран"}
                            disabled={true} />
            </div>
            <div styleName="buttons-wrapper">
              <ButtonControl onClick={this.onChangeLocation}
                             value="Изменить"/>
            </div>
          </div>

          <form styleName="section" onSubmit={this.onSaveEmail}>
            <div styleName="section-header">Email</div>
            <div styleName="field">
              <div styleName="field-title">Email</div>
              <div styleName="input-wrapper">
                <InputControl value={this.state.emailNew}
                              onChange={this.onChangeEmail} />
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <ButtonControl type="submit"
                             disabled={!this.state.dirtyEmail || this.state.errorEmail}
                             value="Изменить email"/>
            </div>
            {this.state.successEmailState &&
              <div styleName="field-success">
                <div>
                  Ваш email был изменён. Мы отправили вам письмо со ссылкой подтверждения. До подтверждения будет использовать ваш старый email <b>{this.state.email}</b>.
                </div>
                <div styleName="field-success-resend" onClick={this.resendVerification}>
                  Отправить подтверждение повторно
                </div>
              </div>
            }
            <div styleName="field-error">
              {this.state.errorEmail}
            </div>
          </form>

          <form styleName="section" onSubmit={this.onSavePassword}>
            <div styleName="section-header">Изменение пароля</div>
            <div styleName="field">
              <div styleName="field-title">Введите текущий пароль</div>
              <div styleName="input-wrapper">
                <InputControl inputType="password"
                              value={this.state.passwordOld}
                              onChange={this.onChangePasswordOld} />
              </div>
            </div>
            <div styleName="field">
              <div styleName="field-title">Введите новый пароль</div>
              <div styleName="input-wrapper">
                <InputControl inputType="password"
                              value={this.state.password}
                              onChange={this.onChangePassword} />
              </div>
            </div>
            <div styleName="field">
              <div styleName="field-title">Введите новый пароль повторно</div>
              <div styleName="input-wrapper">
                <InputControl inputType="password"
                              value={this.state.passwordConfirm}
                              onChange={this.onChangePasswordConfirm} />
              </div>
            </div>
            <div styleName="buttons-wrapper">
              <ButtonControl type="submit"
                             disabled={!this.state.dirtyPassword || this.state.errorPassword}
                             value="Изменить пароль"/>
            </div>
            <div styleName="field-success">
              {this.state.successPassword}
            </div>
            <div styleName="field-error">
              {this.state.errorPassword}
            </div>
          </form>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:  bindActionCreators({showModal}, dispatch),
    userActions: bindActionCreators({update, updateEmail, updatePassword, resendVerEmail}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);