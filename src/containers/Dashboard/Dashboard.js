import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

import {showAlert, showModal} from "ducks/nav";

import CalendarComponent from "components/main/Dashboard/CalendarComponent/CalendarComponent";
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './Dashboard.sss';


@CSSModules(styles, {allowMultiple: true})
class Dashboard extends Component {
  render() {

    return (
      <div styleName="Dashboard">
        <Helmet>
          <title>Моя страница — BrainyDo</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">ДАШБОАРД!</div>
        </div>
        <div styleName='content'>
          <CalendarComponent />
          <Link to="/event-edit">
            <ButtonControl value="Создать событие" />
          </Link>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:  bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);