import {LOGIN_RESPONSE, REGISTER_RESPONSE} from 'ducks/user';
import {init as init_events,        INIT_END as INIT_END_events}        from 'ducks/events';
import {init as init_organizations, INIT_END as INIT_END_organizations} from 'ducks/organizations';
import {initEnd} from 'ducks/nav';


export const initialization = store => next => action => {
  next(action);

  if ((action.type == REGISTER_RESPONSE || action.type == LOGIN_RESPONSE) &&
      action.authorized) {
    next(init_events());
  }
  
  if (action.type == INIT_END_events)
    next(init_organizations());
  
  if (action.type == INIT_END_organizations)
    next(initEnd());
};
