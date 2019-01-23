import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import 'flatpickr/dist/flatpickr.min.css';
import {Russian} from "flatpickr/dist/l10n/ru";
import Flatpickr from 'react-flatpickr';

import {EventData, AGE_LIMITS, AGE_LIMIT_NO_LIMIT, FILTER_DATE_VALUES} from "models/EventData";
import {showAlert, showModal} from "ducks/nav";
import {createEvent} from "ducks/events";
import {getTextDateTime} from "utils/common";

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';

import styles from './EventCreateView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventCreateView extends Component {
  state = {
    name: '',
    description: '',
    dateStart: new Date(),
    dateEnd: new Date(),
    dateEndEnabled: false,
    tags: [],
    price: 0,
    ageLimit: AGE_LIMIT_NO_LIMIT
  };
  event = new EventData();

  constructor(props) {
    super(props);
  }

  onCreate = () => {
    this.event.owner = this.props.user.userData;

    const {createEvent} = this.props.eventsActions;
    createEvent(this.event);
  };

  onChangeName = name => {
    this.setState({name});
  };

  onChangeDescription = event => {
    const description = event.target.value;
    this.setState({description});
  };

  onChangePrice = price => {
    this.setState({price});
  };

  onChangeAgeLimit = ageLimit => {
    this.setState({ageLimit});
  };

  onChangeDateStart = _date => {
    const dateStart = _date[0];
    this.setState({dateStart});
  };

  onChangeDateEnd = _date => {
    const dateEnd = _date[0];
    this.setState({dateEnd});
  };

  onChangeDateEndEnabled = dateEndEnabled => {
    this.setState({dateEndEnabled});
  };

  validate() {

  }

  render() {
    const imageSrc = event.image ? event.image.url() : require('assets/images/event-empty.png');

    return (
      <div styleName="EventCreateView">
        <Helmet>
          <title>Новое событие — Triple L</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Новое событие</div>
        </div>

        <div styleName='content'>
          <div styleName="image"
               style={{backgroundImage: `url(${imageSrc}`}} />

          <div styleName="text">
            <div styleName="name">
              <div>Название события:</div>
              <div styleName="name-input">
                <InputControl value={this.state.name}
                              onChange={this.onChangeName} />
              </div>
            </div>

            <div styleName="caption">Описание события:</div>
            <textarea value={this.state.description}
                      styleName="area-description"
                      onChange={this.onChangeDescription} />

            <div styleName="price-and-age">
              <div styleName="price">
                <div>Стоимость участия:</div>
                <div styleName="price-input">
                  <InputControl value={this.state.price}
                                onChange={this.onChangePrice} />
                </div>
                <div styleName="price-units">рублей</div>
              </div>

              <div styleName="age">
                <div>Возрастное ограничение:</div>
                <div styleName="age-dropdown">
                  <DropdownControl suggestionsList={AGE_LIMITS}
                                   onSuggest={this.onChangeAgeLimit}
                                   current={this.state.ageLimit} />
                </div>
              </div>
            </div>

            <div styleName="date">
              <div styleName="date-start">
                <div>Дата/время начала:</div>
                <div styleName="date-picker">
                  <Flatpickr value={this.state.dateStart}
                             options={{
                               locale: Russian,
                               formatDate: getTextDateTime
                             }}
                             onChange={this.onChangeDateStart}/>
                </div>
              </div>
              <div styleName="date-end">
                <CheckboxControl onChange={this.onChangeDateEndEnabled}
                                 checked={this.state.dateEndEnabled} />
                <div>Дата/время окончания:</div>
                <div styleName="date-picker">
                  <Flatpickr value={this.state.dateEnd}
                             options={{
                               locale: Russian,
                               formatDate: getTextDateTime
                             }}
                             onChange={this.onChangeDateEnd}/>
                </div>
              </div>
            </div>

            <div styleName="button-wrapper">
                <ButtonControl onClick={this.onCreate}
                               value="Создать событие"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events:       state.events,
    user:         state.user,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({createEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCreateView);