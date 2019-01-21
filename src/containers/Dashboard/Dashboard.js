import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showAlert, showModal} from "ducks/nav";

import CalendarComponent from "components/main/Dashboard/CalendarComponent/CalendarComponent";

import styles from './Dashboard.sss';


@CSSModules(styles, {allowMultiple: true})
class Dashboard extends Component {
  render() {
    return (
      <div styleName="Dashboard">
        <Helmet>
          <title>Моя страница — Triple L</title>
        </Helmet>
        <div styleName="title">ДАШБОАРД!</div>
        <CalendarComponent />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);