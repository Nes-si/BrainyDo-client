import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showEvents, joinEvent, leaveEvent} from "ducks/events";
import {FilterEventData, FILTER_DATE_FUTURE, FILTER_REGION_VALUE} from "models/EventData";

import EventCard from 'components/main/EventsList/EventCard/EventCard';
import EventFilterComponent from 'components/main/EventsList/EventFilterComponent/EventFilterComponent';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './EventsList.sss';


@CSSModules(styles, {allowMultiple: true})
class EventsList extends Component {
  filterComp = null;
  startFilter = new FilterEventData();

  constructor(props) {
    super(props);

    if (props.location.search) {
      this.startFilter = this.parseParams(props.location.search);
      props.eventsActions.showEvents(this.startFilter);

    } else {
      let paramsStr = `?dateType=${FILTER_DATE_FUTURE}`;
      this.startFilter.date.type = FILTER_DATE_FUTURE;

      const userLoc = props.user.userData.location;
      if (userLoc) {
        paramsStr += `&regionType=${FILTER_REGION_VALUE}`;
        this.startFilter.region.type = FILTER_REGION_VALUE;

        paramsStr += `&settlementFias=${userLoc.settlementFias}`;
        this.startFilter.region.settlementFias = userLoc.settlementFias;
      }

      this.props.history.replace(`${props.match.url}${paramsStr}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search != nextProps.location.search) {
      const paramsStr = this.parseParams(nextProps.location.search);
      this.props.eventsActions.showEvents(paramsStr);
    }
  }

  parseParams = paramsStr => {
    let params = new URLSearchParams(paramsStr);

    const filter = new FilterEventData();

    if (params.has('search'))
      filter.search = decodeURIComponent(params.get('search'));

    if (params.has('dateType'))
      filter.date.type = params.get('dateType');
    if (params.has('dateFrom'))
      filter.date.greaterThan = new Date(decodeURIComponent(params.get('dateFrom')));
    if (params.has('dateTo'))
      filter.date.lessThan = new Date(decodeURIComponent(params.get('dateTo')));

    if (params.has('priceType'))
      filter.price.type = params.get('priceType');
    if (params.has('priceMax'))
      filter.price.max = parseInt(params.get('priceMax'));

    if (params.has('ageType'))
      filter.ageLimit.type = params.get('ageType');
    if (params.has('ageLimit'))
      filter.ageLimit.limit = decodeURIComponent(params.get('ageLimit'));

    if (params.has('regionType'))
      filter.region.type = params.get('regionType');
    if (params.has('settlementFias'))
      filter.region.settlementFias = params.get('settlementFias');
    if (params.has('regionFias'))
      filter.region.regionFias = params.get('regionFias');

    //this.filter.tags = this.state.tags;

    return filter;
  };

  onFilterChange = paramsStr => {
    this.props.history.replace(`${this.props.match.url}${paramsStr}`);
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
          <title>Список событий — BrainyDo</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Список событий</div>
        </div>

        <div styleName='content'>
          <EventFilterComponent ref={elm => this.filterComp = elm}
                                onApply={this.onFilterChange}
                                startFilter={this.startFilter}
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
    user:   state.user,
    events: state.events,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({showEvents, joinEvent, leaveEvent}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);