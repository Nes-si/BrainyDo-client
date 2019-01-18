import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';

import {showAlert, showModal} from "ducks/nav";

import EventCard from 'components/main/EventsList/EventCard/EventCard';
import EventFilterComponent from 'components/main/EventsList/EventFilterComponent/EventFilterComponent';

import styles from './EventsList.sss';


@CSSModules(styles, {allowMultiple: true})
class EventsList extends Component {
  render() {
    const events = [{
      name: 'Лепка из говна',
      description: 'Будем лепить из говна куличики.',
      date: new Date()
    }];

    return (
      <div>
        <div styleName="title">Список событий!</div>
        <EventFilterComponent />
        {events.map(event =>
          <EventCard event={event} />)
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);