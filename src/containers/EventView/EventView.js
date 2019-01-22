import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showAlert, showModal} from "ducks/nav";
import {showEvent, joinEvent, leaveEvent} from "ducks/events";
import {getEventDate} from "utils/common";
import {isMeEventMember} from "utils/data";

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './EventView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventView extends Component {
  constructor(props) {
    super(props);

    if (props.match.params.id)
      props.eventsActions.showEvent(props.match.params.id);
  }

  onJoin = () => {
    const {currentEvent} = this.props.events;
    const {joinEvent} = this.props.eventsActions;
    joinEvent(currentEvent);
  };

  onLeave = () => {
    const {currentEvent} = this.props.events;
    const {leaveEvent} = this.props.eventsActions;
    leaveEvent(currentEvent);
  };

  render() {
    const event = this.props.events.currentEvent;
    if (!event)
      return <LoaderComponent />;

    const dateStart = getEventDate(event.dateStart);
    const dateEnd = event.dateEnd ? getEventDate(event.dateEnd) : null;

    const imageSrc = event.image ? event.image.url() : require('assets/images/event-empty.png');

    const isMember = isMeEventMember(event);

    const {userData} = this.props.user;
    const isOwner = event.owner.origin.id == userData.origin.id;

    return (
      <div styleName="EventView">
        <Helmet>
          <title>{event.name} — Triple L</title>
        </Helmet>

        <div styleName="image"
             style={{backgroundImage: `url(${imageSrc}`}} />

        <div styleName="content">
          <div styleName="title">{event.name}</div>

          {event.description &&
            <div styleName="description">{event.description}</div>
          }

          {event.price ?
            <div styleName="cost">{event.price} рублей</div>
          :
            <div styleName="cost">Бесплатно!</div>
          }

          <div styleName="date">{dateStart}</div>

          {dateEnd &&
            <div styleName="date">{dateEnd}</div>
          }

          {event.ageLimit &&
            <div styleName="date">{event.ageLimit}</div>
          }

          <div styleName="date">{event.place}</div>

          {(event.tags && !!event.tags.length) &&
            <div styleName="tags">
              {event.tags.map((tag, i) =>
                <div key={i} styleName="tag">{tag}</div>)}
            </div>
          }

          {isOwner ?
            <div styleName="expand">Я создатель события, ёпта</div>
          :
            <div styleName="button-wrapper">
              {isMember ?
                <ButtonControl onClick={this.onLeave}
                               color="red"
                               value="Не пойду"/>
              :
                <ButtonControl onClick={this.onJoin}
                               value="Пойду"/>
              }
            </div>
          }
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
    eventsActions:bindActionCreators({showEvent, joinEvent, leaveEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventView);