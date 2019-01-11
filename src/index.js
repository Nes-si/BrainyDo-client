import 'whatwg-fetch';

import 'normalize.css';
import './styles.global.sss';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';


export const store = configureStore();

initApp();


class Root extends Component {
  render () {
    return <Provider store={store}>
      <div>Хуй</div>
    </Provider>
  }
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);
