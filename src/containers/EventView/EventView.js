import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

import {showAlert, showModal} from "ducks/nav";
import {showEvent, joinEvent, leaveEvent} from "ducks/events";
import {getEventDateTime} from "utils/common";
import {isMeEventMember} from "utils/data";

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './EventView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventView extends Component {
  state = {
    event: null
  };

  mapElm = null;
  map = null;
  marker = null;


  constructor(props) {
    super(props);

    if (props.match.params.id)
      props.eventsActions.showEvent(props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.event) {
      const event = nextProps.events.currentEvent;
      if (event && event.origin.id == this.props.match.params.id) {
        this.setState({event});
        setTimeout(this.setupGMaps, 1);
      }
    }
  }

  componentDidMount() {
    if (this.state.event)
      this.setupGMaps();
  }

  setupGMaps = () => {
    if (!this.state.event.location)
      return;

    let location = {lat: this.state.event.location.latitude, lng: this.state.event.location.longitude};

    this.map = new google.maps.Map(this.mapElm, {
      center: location,
      zoom: 19,
      mapTypeControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy'
    });

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
  };

  onJoin = () => {
    const {joinEvent} = this.props.eventsActions;
    joinEvent(this.state.event);
  };

  onLeave = () => {
    const {leaveEvent} = this.props.eventsActions;
    leaveEvent(this.state.event);
  };

  getMembersTitle = () => {
    const {members} = this.state.event;
    const count = members.length;
    const rest = count % 10;
    if (rest == 1)
      return `${count} участник`;
    else if (rest >= 2 && rest <= 4)
      return `${count} участника`;
    else
      return `${count} участников`;
  };

  getMembersImgs = () => {
    const {members} = this.state.event;

    if (!members.length)
      return;

    const res = [];
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      if (!member.imageMini)
        continue;

      res.push(<img styleName="member-image"
                    src={member.imageMini.url()}
                    key={i}/>);
    }

    return res;
  };

  render() {
    const {event} = this.state;
    if (!event)
      return <LoaderComponent />;

    const dateStart = getEventDateTime(event.dateStart);
    const dateEnd = event.dateEnd ? getEventDateTime(event.dateEnd) : null;

    const imageSrc = event.image ? event.image.url() : require('assets/images/event-empty.png');

    const isMember = isMeEventMember(event);

    const {userData} = this.props.user;
    const isOwner = event.owner.origin.id == userData.origin.id;

    return (
      <div styleName="EventView">
        <Helmet>
          <title>{event.name} — Triple L</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">{event.name}</div>
        </div>

        <div styleName='content'>
          <div styleName="image"
               style={{backgroundImage: `url(${imageSrc}`}} />

          <div styleName="text">
            <div styleName="description">{event.description}</div>

            <div styleName="cost">{event.price ? event.price + ' рублей' : 'Бесплатно!'}</div>

            <div styleName="date">{dateStart} {dateEnd ? ' — ' + dateEnd : ''}</div>

            {event.ageLimit &&
              <div styleName="date">{event.ageLimit}</div>
            }

            {event.location &&
              <div styleName="location">
                <div styleName="place">{event.locationPlace}</div>
                <div styleName="place">{event.locationCity}, {event.locationAddress}</div>
                <div styleName="place">{event.locationDetails}</div>
                <div styleName="map" ref={elm => this.mapElm = elm}></div>
              </div>
            }

            {(event.tags && !!event.tags.length) &&
              <div styleName="tags">
                {event.tags.map((tag, i) =>
                  <div key={i} styleName="tag">{tag}</div>)}
              </div>
            }

            <div styleName="members">
              {this.getMembersTitle()}:
              {this.getMembersImgs()}
            </div>

            <div styleName="button-wrapper">
              {isOwner ?
                <Link to={{pathname: "/event-edit", search: `?id=${event.origin.id}`}}>
                  <ButtonControl value="Редактировать"/>
                </Link>
              : (isMember ?
                  <ButtonControl onClick={this.onLeave}
                                 color="red"
                                 value="Не пойду"/>
                :
                  <ButtonControl onClick={this.onJoin}
                                 value="Пойду"/>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({showEvent, joinEvent, leaveEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventView);