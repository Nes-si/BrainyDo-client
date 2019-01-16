import {combineReducers} from 'redux';

import user from './user';
import events from './events';
import organizations from './organizations';
import nav from './nav';
import users from './users';
import serverStatus from './serverStatus';



export default combineReducers({
  user,
  events,
  organizations,
  users,
  nav,
  serverStatus
});