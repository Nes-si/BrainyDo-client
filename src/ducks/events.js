import {Parse} from 'parse';

import {EventData, FilterEventData} from 'models/EventData';
import {store} from 'index';
import {send, getAllObjects} from 'utils/server';
import {getPermissibleAgeLimits} from 'utils/data';


export const INIT_END     = 'app/events/INIT_END';
export const SHOW_EVENTS  = 'app/events/SHOW_EVENTS';


async function requestEvents(filter = {}) {
  const userData = store.getState().user.userData;

  const query = new Parse.Query(EventData.OriginClass);
  if (filter.members) {
    if (filter.members.onlyMy)
      query.equalTo("members", Parse.User.current());
  }
  if (filter.date) {
    if (filter.date.greaterThan)
      query.greaterThan("dateEnd", filter.date.greaterThan);
    if (filter.date.lessThan)
      query.lessThan("dateStart", filter.date.lessThan);
    if (filter.date.onlyFuture)
      query.greaterThan("dateEnd", new Date());
    if (filter.date.onlyPast)
      query.lessThan("dateStart", new Date());
  }
  if (filter.price) {
    if (filter.price.onlyFree) {
      query.equalTo("price", 0);
    } else {
      if (filter.price.greaterThan)
        query.greaterThan("price", filter.price.greaterThan);
      if (filter.price.lessThan)
        query.lessThan("price", filter.price.lessThan);
    }
  }
  if (filter.age) {
    if (filter.age.my)
      query.containsIn("ageLimit", getPermissibleAgeLimits(userData.age));
    if (filter.age.age)
      query.containsIn("ageLimit", getPermissibleAgeLimits(filter.age.age));
  }

  const events_o = await send(getAllObjects(query));

  const events = [];
  for (let event_o of events_o) {
    const event = new EventData().setOrigin(event_o);
    events.push(event);
  }

  return events;
}

export function init() {
  return async dispatch => {
    const filterMy = new FilterEventData();
    filterMy.members.onlyMy = true;
    filterMy.date.onlyFuture = true;

    dispatch({
      type: INIT_END,
      events: await requestEvents(filterMy)
    });
  };
}

export function showEvents(filter = {}) {
  return async dispatch => {
    const events = await requestEvents(filter);
    dispatch({
      type: SHOW_EVENTS,
      events
    });
  };
}

const initialState = {
  userEvents: [],
  currentEvents: []
};

export default function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        userEvents: action.events
      };

    case SHOW_EVENTS:
      return {
        ...state,
        currentEvents: action.events
      };

    default:
      return state;
  }
}
