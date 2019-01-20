import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";

import {showAlert, showModal} from "ducks/nav";
import {showEvent} from "ducks/events";

import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";
import ButtonControl from "components/main/EventsList/EventCard/EventCard";

import styles from './EventView.sss';


@CSSModules(styles, {allowMultiple: true})
class EventView extends Component {
  constructor(props) {
    super(props);

    if (props.match.params.id)
      props.eventsActions.showEvent(props.match.params.id);
  }

  onJoin = () => {
    const {onJoin} = this.props;
    onJoin();
  };

  render() {
    const event = this.props.events.currentEvent;
    if (!event)
      return <LoaderComponent />;

    const date = event.dateStart.toLocaleString();

    return (
      <div styleName="EventView">
        <Helmet>
          <title>Событие — Triple L</title>
        </Helmet>

        <div styleName="title">Событие!</div>

        <div styleName="title">{event.name}</div>

        <div styleName="description">{event.description}</div>

        {event.price ?
          <div styleName="cost">{event.price}</div>
          :
          <div styleName="cost">Free</div>
        }

        <div styleName="date">{date}</div>

        <div styleName="button-wrapper">
          <ButtonControl onClick={this.onJoin}
                         value="Пойду"/>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events:       state.events,
    user:         state.user,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({showEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventView);