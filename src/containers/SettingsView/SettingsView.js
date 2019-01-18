import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';

import {showAlert, showModal} from "ducks/nav";

import styles from './SettingsView.sss';


@CSSModules(styles, {allowMultiple: true})
class SettingsView extends Component {
  render() {
    return (
      <div>
        <div styleName="title">Настройки!</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);