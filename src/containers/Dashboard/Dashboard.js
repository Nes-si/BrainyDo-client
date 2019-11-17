import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

import {showModal} from "ducks/nav";

import CalendarComponent from "components/main/Dashboard/CalendarComponent/CalendarComponent";
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './Dashboard.sss';


@CSSModules(styles, {allowMultiple: true})
class Dashboard extends Component {
  render() {
    const {events} = this.props;

    return (
      <div styleName="Dashboard">
        <Helmet>
          <title>Моя страница — BrainyDo</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Домой</div>
        </div>
        <div styleName='content'>

          <Link to="/event-edit">
            <ButtonControl value="Создать событие" />
          </Link>

          <div styleName="item">
            <CalendarComponent userEvents={events.userEvents} />
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:  bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);