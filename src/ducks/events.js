import {Parse} from 'parse';

import {EventData, FilterEventData, FILTER_DATE_OFF, FILTER_DATE_FUTURE, FILTER_DATE_TODAY, FILTER_DATE_TOMORROW, FILTER_DATE_VALUES,
  FILTER_DATE_WEEK, FILTER_DATE_WEEKEND} from 'models/EventData';
import {store} from 'index';
import {send, getAllObjects} from 'utils/server';
import {getPermissibleAgeLimits, getAgeLimitsByLimit} from 'utils/data';
import {UserData} from "models/UserData";


export const INIT_END           = 'app/events/INIT_END';
export const SHOW_START_EVENTS  = 'app/events/SHOW_START_EVENTS';
export const SHOW_EVENTS        = 'app/events/SHOW_EVENTS';
export const SHOW_EVENT         = 'app/events/SHOW_EVENT';
export const JOIN_EVENT         = 'app/events/JOIN_EVENT';
export const LEAVE_EVENT        = 'app/events/LEAVE_EVENT';
export const CREATE_EVENT       = 'app/events/CREATE_EVENT';
export const UPDATE_EVENT       = 'app/events/UPDATE_EVENT';
export const DELETE_EVENT       = 'app/events/DELETE_EVENT';
export const PENDING_START      = 'app/events/PENDING_START';



async function requestEvents(filter = {}) {
  const userData = store.getState().user.userData;

  let query = new Parse.Query(EventData.OriginClass);

  if (filter.date && filter.date.type != FILTER_DATE_OFF) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDOW = todayStart.getDay() ? todayStart.getDay() : 7;

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date(todayEnd);
    weekEnd.setDate(todayStart.getDate() + (7 - todayDOW));

    const query2 = new Parse.Query(EventData.OriginClass);
    query2.doesNotExist("dateEnd");

    switch (filter.date.type) {
      case FILTER_DATE_FUTURE:
        query.greaterThan("dateEnd", new Date());
        query2.greaterThan("dateStart", todayStart);

        query = Parse.Query.or(query, query2);
        break;

      case FILTER_DATE_TODAY:
        query.greaterThan("dateEnd", new Date());
        query.lessThan("dateStart", todayEnd);

        query2.greaterThanOrEqualTo("dateStart", todayStart);
        query2.lessThan("dateStart", todayEnd);

        query = Parse.Query.or(query, query2);
        break;

      case FILTER_DATE_TOMORROW:
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);

        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);

        query.greaterThan("dateEnd", tomorrowStart);
        query.lessThan("dateStart", tomorrowEnd);

        query2.greaterThanOrEqualTo("dateStart", tomorrowStart);
        query2.lessThan("dateStart", tomorrowEnd);

        query = Parse.Query.or(query, query2);

        break;

      case FILTER_DATE_WEEK:
        query.greaterThan("dateEnd", new Date());
        query.lessThan("dateStart", weekEnd);

        query2.greaterThanOrEqualTo("dateStart", todayStart);
        query2.lessThan("dateStart", weekEnd);

        query = Parse.Query.or(query, query2);

        break;

      case FILTER_DATE_WEEKEND:
        const weekEndStart = new Date();
        const diff = 6 - todayDOW;
        if (diff > 0) {
          weekEndStart.setDate(todayStart.getDate() + diff);
          weekEndStart.setHours(0, 0, 0, 0);
        }

        query.greaterThanOrEqualTo("dateEnd", weekEndStart);
        query.lessThan("dateStart", weekEnd);

        query2.greaterThanOrEqualTo("dateStart", weekEndStart);
        query2.lessThan("dateStart", weekEnd);

        query = Parse.Query.or(query, query2);

        break;

      case FILTER_DATE_VALUES:
        if (filter.date.lessThan) {
          filter.date.lessThan.setHours(23, 59, 59, 999);
          query.lessThanOrEqualTo("dateStart", filter.date.lessThan);
          query2.lessThanOrEqualTo("dateStart", filter.date.lessThan);
        }

        if (filter.date.greaterThan) {
          filter.date.greaterThan.setHours(0, 0, 0, 0);
          query.greaterThanOrEqualTo("dateEnd", filter.date.greaterThan);
          query2.greaterThanOrEqualTo("dateStart", filter.date.greaterThan);
          query = Parse.Query.or(query, query2);
        }

        break;
    }
  }

  if (filter.members) {
    if (filter.members.onlyMy) {
      const query1 = Parse.Query.or(query);
      const query2 = Parse.Query.or(query);
      query1.equalTo("members", Parse.User.current());
      query2.equalTo("owner", Parse.User.current());
      query = Parse.Query.or(query1, query2);
    }
  }

  if (filter.price) {
    if (filter.price.onlyFree)
      query.containedIn("price", [0, undefined]);
    else if (filter.price.lessThan)
      query.lessThanOrEqualTo("price", filter.price.lessThan);
  }

  if (filter.ageLimit) {
    if (filter.ageLimit.my)
      query.containedIn("ageLimit", getPermissibleAgeLimits(userData.age));
    if (filter.ageLimit.age)
      query.containedIn("ageLimit", getPermissibleAgeLimits(filter.age.age));
    if (filter.ageLimit.ageLimit)
      query.containedIn("ageLimit", getAgeLimitsByLimit(filter.ageLimit.ageLimit));
  }

  if (filter.tags && filter.tags.length) {
    query.containedIn("tags", filter.tags);
  }

  const events_o = await send(getAllObjects(query));

  const events = [];
  for (let event_o of events_o) {
    const event = new EventData(event_o);

    event.owner = new UserData(event_o.get('owner'));

    const members_o = event_o.get('members');
    if (members_o) {
      for (let member_o of members_o)
        event.members.push(new UserData(member_o));
    }
    
    events.push(event);
  }

  return events;
}

export function showStartEvents() {
  return async dispatch => {
    let filter = new FilterEventData();
    filter.date.today = true;
    const eventsToday = await requestEvents(filter);

    filter = new FilterEventData();
    filter.date.tomorrow = true;
    const eventsTomorrow = await requestEvents(filter);

    filter = new FilterEventData();
    const eventsNext = await requestEvents(filter);

    dispatch({
      type: SHOW_START_EVENTS,
      eventsToday,
      eventsTomorrow,
      eventsNext
    })
  };
}

export function init() {
  return async dispatch => {
    const filterMy = new FilterEventData();
    filterMy.members.onlyMy = true;

    const events = await requestEvents(filterMy);

    dispatch({
      type: INIT_END,
      events
    });
  };
}

export function showEvents(filter = {}) {
  console.log(filter);
  return async dispatch => {
    dispatch({
      type: PENDING_START
    });
    const events = await requestEvents(filter);
    dispatch({
      type: SHOW_EVENTS,
      events
    });
  };
}

export function showEvent(id) {
  return async dispatch => {
    const event_o = await send(new Parse.Query(EventData.OriginClass).get(id));
    const event = new EventData(event_o);

    event.owner = new UserData(event_o.get('owner'));

    const members_o = event_o.get('members');
    if (members_o) {
      await send(Parse.Object.fetchAll(members_o));
      for (let member_o of members_o)
        event.members.push(new UserData(member_o));
    }

    dispatch({
      type: SHOW_EVENT,
      event
    });
  }
}

export function joinEvent(event) {
  send(
    Parse.Cloud.run('joinEvent', {id: event.origin.id})
  );

  return {
    type: JOIN_EVENT,
    event
  };
}

export function leaveEvent(event) {
  send(
    Parse.Cloud.run('leaveEvent', {id: event.origin.id})
  );

  return {
    type: LEAVE_EVENT,
    event
  };
}

export function createEvent(event) {
  event.updateOrigin();
  event.origin.setACL(new Parse.ACL(event.owner.origin));
  send(event.origin.save());

  return {
    type: CREATE_EVENT,
    event
  };
}

export function updateEvent(event) {
  event.updateOrigin();
  send(event.origin.save());

  return {
    type: UPDATE_EVENT,
    event
  };
}

export function deleteEvent(event) {
  send(event.origin.destroy());

  return {
    type: DELETE_EVENT,
    event
  };
}

const initialState = {
  startEvents: {
    eventsToday: [],
    eventsTomorrow: [],
    eventsNext: []
  },

  userEvents: [],

  currentEvents: [],

  pending: false,

  currentEvent: null
};

export default function eventsReducer(state = initialState, action) {
  let userEvents;

  switch (action.type) {
    case SHOW_START_EVENTS:
      return {
        ...state,
        startEvents: {
          eventsToday: action.eventsToday,
          eventsTomorrow: action.eventsTomorrow,
          eventsNext: action.eventsNext
        }
      };

    case INIT_END:
      return {
        ...state,
        userEvents: action.events
      };

    case SHOW_EVENTS:
      return {
        ...state,
        currentEvents: action.events,
        pending: false
      };

    case SHOW_EVENT:
      return {
        ...state,
        currentEvent: action.event
      };

    case JOIN_EVENT:
      userEvents = state.userEvents.slice();
      userEvents.push(action.event);
      return {
        ...state,
        userEvents
      };

    case LEAVE_EVENT:
      userEvents = state.userEvents.slice();
      let eventInd = -1;
      for (let i = 0; i < userEvents.length; i++) {
        if (userEvents[i].origin.id == action.event.origin.id){
          eventInd = i;
          break;
        }
      }
      if (eventInd != -1) {
        userEvents.splice(eventInd, 1);
        return {
          ...state,
          userEvents
        };
      }
      return state;

    case CREATE_EVENT:
      userEvents = state.userEvents;
      userEvents.push(action.event);
      return {
        ...state,
        userEvents
      };

    case UPDATE_EVENT:
      return state;

    case DELETE_EVENT:
      userEvents = state.userEvents;
      userEvents.splice(userEvents.indexOf(action.event), 1);

      return {
        ...state,
        event
      };

    case PENDING_START:
      return {
        ...state,
        pending: true
      };

    default:
      return state;
  }
}
