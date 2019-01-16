import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';

import styles from './MainView.sss';


@CSSModules(styles, {allowMultiple: true})
class MainView extends Component {
  render() {
    return null;
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);