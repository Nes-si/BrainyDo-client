import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet-async";
import {Link} from 'react-router-dom';

import {showModal} from "ducks/nav";

import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
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
      <ContainerComponent title="Мои события">
        <Helmet>
          <title>Моя страница — BrainyDo</title>
        </Helmet>

        <Link to="/event-edit">
          <ButtonControl value="Создать событие" />
        </Link>

        <div styleName="modes">
          <div styleName={"mode" + (this.state.mode == MODE_CAL ? " mode-enabled" : "")}
               onClick={() => this.setMode(MODE_CAL)}>
            Календарь
          </div>
          <div styleName={"mode" + (this.state.mode == MODE_FLOW ? " mode-enabled" : "")}
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
      </ContainerComponent>
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