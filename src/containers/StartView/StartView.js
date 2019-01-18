import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import {showModal, showAlert} from 'ducks/nav';

import styles from './StartView.sss';


@CSSModules(styles, {allowMultiple: true})
class StartView extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Добро пожаловать — Triple L</title>
        </Helmet>
        <div className='title'>
          Привет! Это пиздатый сервис.
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:         state.user,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:  bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);