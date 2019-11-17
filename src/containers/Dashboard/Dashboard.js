import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

import {showModal} from "ducks/nav";

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import CalendarComponent from "components/main/Dashboard/CalendarComponent/CalendarComponent";
import EventsFlowComponent from "components/main/Dashboard/EventsFlowComponent/EventsFlowComponent";

import styles from './Dashboard.sss';


const MODE_CAL = "MODE_CAL";
const MODE_FLOW = "MODE_FLOW";


@CSSModules(styles, {allowMultiple: true})
class Dashboard extends Component {
  state = {
    mode: MODE_CAL,
    onlyOwn: false
  };

  setMode = mode => {
    this.setState({mode});
  };

  onChangeOwn = value => {
    this.setState({onlyOwn: value});
  };

  render() {
    const {events, user} = this.props;
    const {onlyOwn} = this.state;

    return (
      <div styleName="Dashboard">
        <Helmet>
          <title>Моя страница — BrainyDo</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Мои события</div>
        </div>
        <div styleName='content'>

          <Link to="/event-edit">
            <ButtonControl value="Создать событие" />
          </Link>

          <div styleName="modes">
            <div styleName="mode"
                 onClick={() => this.setMode(MODE_CAL)}>
              Календарь
            </div>
            <div styleName="mode"
                 onClick={() => this.setMode(MODE_FLOW)}>
              Поток
            </div>
          </div>

          <div styleName="view">
            <CheckboxControl title="Только созданные мной события"
                             onChange={this.onChangeOwn}
                             checked={onlyOwn} />
          </div>

          {this.state.mode == MODE_CAL &&
            <div styleName="view">
              <CalendarComponent userEvents={events.userEvents}
                                 userData={user.userData}
                                 onlyOwn={onlyOwn} />
            </div>
          }
          {this.state.mode == MODE_FLOW &&
            <div styleName="view">
              <EventsFlowComponent userEvents={events.userEvents}
                                   userData={user.userData}
                                   onlyOwn={onlyOwn} />
            </div>
          }
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