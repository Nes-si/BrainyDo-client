import 'whatwg-fetch';

import 'normalize.css';
import './fonts.css';
import './styles.global.sss';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';
import App from 'containers/app';
import StartView from 'containers/StartView/StartView';
import MainView from 'containers/MainView/MainView';


export const store = configureStore();

initApp();


class Root extends Component {
  render () {
    return <Provider store={store}>
        <App>
          <StartView/>
        </App>
    </Provider>
  }
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);
