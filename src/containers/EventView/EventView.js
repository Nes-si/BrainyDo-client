import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';

import {showAlert, showModal} from "ducks/nav";

import styles from './EventView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventView extends Component {
  render() {
    return (
      <div>
        <div styleName="title">Событие!</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventView);