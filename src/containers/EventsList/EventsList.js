import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showAlert, showModal} from "ducks/nav";
import {showEvents, joinEvent, leaveEvent} from "ducks/events";
import {FilterEventData, FILTER_DATE_FUTURE} from "models/EventData";

import EventCard from 'components/main/EventsList/EventCard/EventCard';
import EventFilterComponent from 'components/main/EventsList/EventFilterComponent/EventFilterComponent';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './EventsList.sss';


@CSSModules(styles, {allowMultiple: true})
class EventsList extends Component {
  filterComp = null;

  constructor(props) {
    super(props);

    const filter = new FilterEventData();
    filter.date.type = FILTER_DATE_FUTURE;
    props.eventsActions.showEvents(filter);
  }

  onFilterChange = filter => {
    this.props.eventsActions.showEvents(filter);
  };

  onTagClick = tag => {

  };

  render() {
    const {pending} = this.props.events;
    const events = this.props.events.currentEvents;
    const {userData} = this.props.user;
    const {joinEvent, leaveEvent} = this.props.eventsActions;

    return (
      <div styleName="EventsList">
        <Helmet>
          <title>Список событий — Triple L</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Список событий</div>
        </div>

        <div styleName='content'>
          <EventFilterComponent ref={elm => this.filterComp = elm}
                                onApply={this.onFilterChange}
                                hasAge={userData.birthdate} />
          {pending ?
            <div styleName="loader">
              <LoaderComponent />
            </div>
          :
            (!!events.length ?
              events.map(event =>
                <EventCard key={event.origin.id}
                           event={event}
                           userData={userData}
                           joinEvent={joinEvent}
                           leaveEvent={leaveEvent}
                           onTagClick={this.onTagClick} />)
            :
              <div styleName="caption-not-found">События не найдены</div>)
          }

        </div>
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
    eventsActions:bindActionCreators({showEvents, joinEvent, leaveEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);