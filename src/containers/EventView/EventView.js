import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet-async";
import {Link} from 'react-router-dom';

import {showEvent, joinEvent, leaveEvent} from "ducks/events";
import {MODAL_TYPE_SIGN, showModal} from "ducks/nav";
import {MODE_REG} from "components/modals/SignModal/SignModal";
import {getEventDateTime, getMembersNumber} from "utils/strings";
import {isMeEventMember} from "utils/data";

import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './EventView.sss';

import ImageDefaultAvatarMini from 'assets/images/default-avatar-mini.png';
import ImageEventEmpty from 'assets/images/event-empty.png';


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

  componentDidMount() {
    if (this.state.event)
      this.setupGMaps();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.event)
      return null;

    const event = props.events.currentEvent;
    if (event && event.origin.id == props.match.params.id)
      return {event};

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.event && !this.map)
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
    const {userData} = this.props.user;

    if (userData) {
      const {joinEvent} = this.props.eventsActions;
      joinEvent(this.state.event);
    } else {
      const {showModal} = this.props.navActions;
      showModal(MODAL_TYPE_SIGN, {mode: MODE_REG});
    }
  };

  onLeave = () => {
    const {leaveEvent} = this.props.eventsActions;
    leaveEvent(this.state.event);
  };

  getMembersImgs = () => {
    const {members} = this.state.event;

    if (!members.length)
      return;

    const res = [];
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      const image = member.imageMini ? member.imageMini.url() : ImageDefaultAvatarMini;

      res.push(<img styleName="member-image"
                    src={image}
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

    const imageSrc = event.image ? event.image.url() : ImageEventEmpty;

    const isMember = isMeEventMember(event);

    const {userData} = this.props.user;
    const isOwner = userData && event.owner.origin.id == userData.origin.id;

    return (
      <ContainerComponent title={event.name}>
        <Helmet>
          <title>{event.name} — BrainyDo</title>
        </Helmet>

        <div styleName="content">
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
                <div styleName="place">{event.locationSettlement}, {event.locationAddress}</div>
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
              {getMembersNumber(event.members.length)}
              {userData && <span>:</span>}
              {userData && this.getMembersImgs()}
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
      </ContainerComponent>
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
    navActions:   bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventView);