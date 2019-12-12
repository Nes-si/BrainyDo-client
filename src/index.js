import 'whatwg-fetch';
import 'normalize.css';

import './fonts.css';
import './styles.global.sss';

import 'react-hot-loader';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import {HelmetProvider} from 'react-helmet-async';

import configureStore from 'store/configureStore';
import {initApp} from 'utils/initialize';
import App from 'containers/app';


export const store = configureStore();

initApp();


class Root extends Component {
  render () {
    return (
      //<React.StrictMode>
        <Provider store={store}>
          <HelmetProvider>
            <Router>
              <App />
            </Router>
          </HelmetProvider>
        </Provider>
      //</React.StrictMode>
    );
  }
}

const root = ReactDOM.render(
  <Root/>,
  document.getElementById('app-root')
);
