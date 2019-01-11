import {combineReducers} from 'redux';

import user from './user';
import serverStatus from './serverStatus';


export default combineReducers({
  user,
  serverStatus
});