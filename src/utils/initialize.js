import {Parse} from 'parse';

import {store} from 'index';
import {getLocalStorage} from 'ducks/user';
import {config as _config} from 'ConnectConstants';


export const config = {};


async function requestConfig() {
  config.serverURL  = process.env.REACT_APP_SERVER_URL  || _config.serverURL;
  config.appId      = process.env.REACT_APP_APP_ID      || _config.appId;

  try {
    const response = await fetch('/triplel-config.json');
    const result = await response.json();
    config.serverURL = result.configServerURL || config.serverURL;
    config.appId = result.configAppId || config.appId;
  } catch (e) {}
}

async function initParse() {
  Parse.initialize(config.appId);
  Parse.serverURL = config.serverURL;
}

export async function initApp() {
  await requestConfig();
  await initParse();
  store.dispatch(getLocalStorage());
}