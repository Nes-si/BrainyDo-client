import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {EventData, AGE_LIMITS, AGE_LIMIT_NO_LIMIT} from "models/EventData";
import {showAlert, showModal} from "ducks/nav";
import {createEvent} from "ducks/events";

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";


import styles from './EventCreateView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventCreateView extends Component {
  state = {
    name: '',
    description: '',
    dateStart: new Date(),
    dateEnd: new Date(),
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

  onChangeName = event => {
    const name = event.target.value;
    this.setState({name});
  };

  onChangeDescription = event => {
    const description = event.target.value;
    this.setState({description});
  };

  onChangePrice = event => {
    const price = event.target.value;
    this.setState({price});
  };

  onChangeAgeLimit = ageLimit => {
    this.setState({ageLimit});
  };

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
            <InputControl label="Название события"
                          value={this.state.name}
                          onChange={this.onChangeName} />

            <div styleName="date">Описание события</div>
            <textarea value={this.state.description}
                      onChange={this.onChangeDescription} />

            <InputControl label="Стоимость участия"
                          value={this.state.price}
                          onChange={this.onChangePrice} />

            <DropdownControl label="Возрастное ограничение"
                             suggestionsList={AGE_LIMITS}
                             suggest={this.onChangeAgeLimit}
                             current={this.state.ageLimit} />

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