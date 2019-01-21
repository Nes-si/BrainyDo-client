import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showAlert, showModal} from "ducks/nav";
import {showEvents, joinEvent} from "ducks/events";

import EventCard from 'components/main/EventsList/EventCard/EventCard';
import EventFilterComponent from 'components/main/EventsList/EventFilterComponent/EventFilterComponent';

import styles from './EventsList.sss';


@CSSModules(styles, {allowMultiple: true})
class EventsList extends Component {
  constructor(props) {
    super(props);

    props.eventsActions.showEvents();
  }

  render() {
    const events = this.props.events.currentEvents;
    const {joinEvent} = this.props.eventsActions;

    return (
      <div styleName="EventsList">
        <Helmet>
          <title>Список событий — Triple L</title>
        </Helmet>
        <div styleName="title">Список событий</div>
        <EventFilterComponent />
        {events.map(event =>
          <EventCard key={event.origin.id}
                     event={event}
                     joinEvent={joinEvent} />)
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user:         state.user,
    events:       state.events,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({showEvents, joinEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);