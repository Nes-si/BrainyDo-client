import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './EventCard.sss';


@CSSModules(styles, {allowMultiple: true})
export default class EventCard extends Component {
  state = {
    expanded: false
  };

  onExpand = expanded => {
    this.setState({expanded});
  };

  onJoin = () => {
    const {onJoin} = this.props;
    onJoin();
  };

  render() {
    const {event} = this.props;
    if (!event)
      return <LoaderComponent />;

    const date = event.dateStart.toLocaleString();

    return (
      <div styleName="EventCard">
        <Link to={`/event${event.origin.id}`}>
          <div styleName="title">{event.name}</div>
        </Link>

        {this.state.expanded ?
          <div styleName="description">{event.description}</div>
        :
          <div styleName="expand" onClick={() => this.onExpand(true)}>Развернуть</div>
        }

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