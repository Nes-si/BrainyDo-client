import {Parse} from 'parse';

import {
  EventData, FilterEventData, FILTER_DATE_OFF, FILTER_DATE_FUTURE, FILTER_DATE_TODAY, FILTER_DATE_TOMORROW,
  FILTER_DATE_VALUES, FILTER_DATE_WEEK, FILTER_DATE_WEEKEND, FILTER_PRICE_OFF, FILTER_PRICE_FREE, FILTER_PRICE_MAX,
  FILTER_AGE_MY, FILTER_AGE_OFF, FILTER_AGE_VALUE, FILTER_REGION_OFF, FILTER_REGION_VALUE, FILTER_AGE_FIX
} from 'models/EventData';
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

  let queryTotal = new Parse.Query(EventData.OriginClass);
  let query;

  if (filter.date && filter.date.type != FILTER_DATE_OFF) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDOW = todayStart.getDay() ? todayStart.getDay() : 7;

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date(todayEnd);
    weekEnd.setDate(todayStart.getDate() + (7 - todayDOW));


    let query1 = new Parse.Query(EventData.OriginClass);

    let query2 = new Parse.Query(EventData.OriginClass);
    query2.doesNotExist("dateEnd");

    switch (filter.date.type) {
      case FILTER_DATE_FUTURE:
        query1.greaterThan("dateEnd", new Date());
        query2.greaterThan("dateStart", todayStart);

        query = Parse.Query.or(query1, query2);
        break;

      case FILTER_DATE_TODAY:
        query1.greaterThan("dateEnd", new Date());
        query1.lessThan("dateStart", todayEnd);

        query2.greaterThanOrEqualTo("dateStart", todayStart);
        query2.lessThan("dateStart", todayEnd);

        query = Parse.Query.or(query1, query2);
        break;

      case FILTER_DATE_TOMORROW:
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);

        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);

        query1.greaterThan("dateEnd", tomorrowStart);
        query1.lessThan("dateStart", tomorrowEnd);

        query2.greaterThanOrEqualTo("dateStart", tomorrowStart);
        query2.lessThan("dateStart", tomorrowEnd);

        query = Parse.Query.or(query1, query2);
        break;

      case FILTER_DATE_WEEK:
        query1.greaterThan("dateEnd", new Date());
        query1.lessThan("dateStart", weekEnd);

        query2.greaterThanOrEqualTo("dateStart", todayStart);
        query2.lessThan("dateStart", weekEnd);

        query = Parse.Query.or(query1, query2);
        break;

      case FILTER_DATE_WEEKEND:
        const weekEndStart = new Date();
        const diff = 6 - todayDOW;
        if (diff > 0) {
          weekEndStart.setDate(todayStart.getDate() + diff);
          weekEndStart.setHours(0, 0, 0, 0);
        }

        query1.greaterThanOrEqualTo("dateEnd", weekEndStart);
        query1.lessThan("dateStart", weekEnd);

        query2.greaterThanOrEqualTo("dateStart", weekEndStart);
        query2.lessThan("dateStart", weekEnd);

        query = Parse.Query.or(query1, query2);
        break;

      case FILTER_DATE_VALUES:
        if (filter.date.to) {
          filter.date.to.setHours(23, 59, 59, 999);
          query1.lessThanOrEqualTo("dateStart", filter.date.to);
          query2.lessThanOrEqualTo("dateStart", filter.date.to);
        }

        if (filter.date.from) {
          filter.date.from.setHours(0, 0, 0, 0);
          query1.greaterThanOrEqualTo("dateEnd", filter.date.from);
          query2.greaterThanOrEqualTo("dateStart", filter.date.from);
          query = Parse.Query.or(query1, query2);
        }

        break;
    }

    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.price && filter.price.type != FILTER_PRICE_OFF) {
    query = new Parse.Query(EventData.OriginClass);

    switch (filter.price.type) {
      case FILTER_PRICE_FREE:
        query.containedIn("price", [0, undefined]);
        break;
      case FILTER_PRICE_MAX:
        query.lessThanOrEqualTo("price", filter.price.max);
        break;
    }

    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.ageLimit && filter.ageLimit.type != FILTER_AGE_OFF) {
    query = new Parse.Query(EventData.OriginClass);

    switch (filter.ageLimit.type) {
      case FILTER_AGE_MY:
        query.containedIn("ageLimit", getPermissibleAgeLimits(userData.age));
        break;
      case FILTER_AGE_FIX:
        query.containedIn("ageLimit", getAgeLimitsByLimit(filter.ageLimit.limit));
        break;
      case FILTER_AGE_VALUE:
        query.containedIn("ageLimit", getPermissibleAgeLimits(filter.ageLimit.age));
        break;
    }

    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.region && filter.region.type != FILTER_REGION_OFF) {
    query = new Parse.Query(EventData.OriginClass);

    if (filter.region.cityFias)
      query.equalTo("locationCityFias", filter.region.cityFias);
    else if (filter.region.regionFias)
      query.equalTo("locationRegionFias", filter.region.regionFias);

    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.members) {
    query = new Parse.Query(EventData.OriginClass);

    if (filter.members.onlyMy)
      query.equalTo("members", Parse.User.current());

    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.tags && filter.tags.length) {
    query = new Parse.Query(EventData.OriginClass);
    query.containedIn("tags", filter.tags);
    queryTotal = Parse.Query.and(queryTotal, query);
  }

  if (filter.search) {
    query = new Parse.Query(EventData.OriginClass);
    query.startsWith("name", filter.search);
    queryTotal = Parse.Query.and(queryTotal, query);
  }

  const events_o = await send(getAllObjects(queryTotal));

  const events = [];
  for (let event_o of events_o) {
    const event = new EventData(event_o);

    const owner_o = event_o.get('owner');
    await owner_o.fetch({include: ['nameFirst', 'nameLast', 'imageMini']});
    event.owner = new UserData(owner_o);

    const members_o = event_o.get('members');
    if (members_o) {
      for (let member_o of members_o) {
        await member_o.fetch({include: ['nameFirst', 'nameLast', 'imageMini']});
        event.members.push(new UserData(member_o));
      }
    }
    
    events.push(event);
  }

  return events;
}

export function showStartEvents() {
  return async dispatch => {
    let filter = new FilterEventData();
    filter.date.type = FILTER_DATE_TODAY;
    const eventsToday = await requestEvents(filter);

    filter = new FilterEventData();
    filter.date.type = FILTER_DATE_TOMORROW;
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

    const owner_o = event_o.get('owner');
    await owner_o.fetch();
    event.owner = new UserData(owner_o);

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
  };
}

export function joinEvent(event) {
  const userData = store.getState().user.userData;

  send(
    Parse.Cloud.run('joinEvent', {id: event.origin.id})
  );

  return {
    type: JOIN_EVENT,
    event,
    userData
  };
}

export function leaveEvent(event) {
  const userData = store.getState().user.userData;

  send(
    Parse.Cloud.run('leaveEvent', {id: event.origin.id})
  );

  return {
    type: LEAVE_EVENT,
    event,
    userData
  };
}

export function createEvent(event) {
  return async dispatch => {
    event.updateOrigin();
    event.origin.set('members', [event.owner.origin]);

    const ACL = new Parse.ACL(event.owner.origin);
    ACL.setPublicReadAccess(true);
    event.origin.setACL(ACL);
    await send(event.origin.save());

    dispatch({
      type: CREATE_EVENT,
      event
    });
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

      //похоже, что это очень плохая практика
      for (let event of state.currentEvents) {
        if (event.origin.id == action.event.origin.id) {
          let ind = event.members.indexOf(action.userData);
          if (ind == -1)
            event.members.push(action.userData);
          break;
        }
      }

      if (state.currentEvent.origin.id == action.event.origin.id) {
        let ind = state.currentEvent.members.indexOf(action.userData);
        if (ind == -1)
          state.currentEvent.members.push(action.userData);
      }

      return {
        ...state,
        userEvents
      };

    case LEAVE_EVENT:
      userEvents = state.userEvents.slice();

      //похоже, что это очень плохая практика
      for (let event of state.currentEvents) {
        if (event.origin.id == action.event.origin.id) {
          for (let i = 0; i < event.members.length; i++) {
            if (event.members[i].origin.id == action.userData.origin.id) {
              event.members.splice(i, 1);
              break;
            }
          }
          break;
        }
      }

      if (state.currentEvent.origin.id == action.event.origin.id) {
        for (let i = 0; i < state.currentEvent.members.length; i++) {
          if (state.currentEvent.members[i].origin.id == action.userData.origin.id) {
            state.currentEvent.members.splice(i, 1);
            break;
          }
        }
      }

      for (let i = 0; i < userEvents.length; i++) {
        if (userEvents[i].origin.id == action.event.origin.id) {
          userEvents.splice(i, 1);
          return {
            ...state,
            userEvents
          };
        }
      }
      return state;

    case CREATE_EVENT:
      userEvents = state.userEvents.slice();
      userEvents.push(action.event);
      return {
        ...state,
        userEvents
      };

    case UPDATE_EVENT:
      return state;

    case DELETE_EVENT:
      userEvents = state.userEvents.slice();
      userEvents.splice(userEvents.indexOf(action.event), 1);

      return {
        ...state,
        userEvents
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
