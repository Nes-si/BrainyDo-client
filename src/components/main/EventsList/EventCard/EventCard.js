import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import {getEventDate} from 'utils/common';

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
    const {joinEvent, event} = this.props;
    joinEvent(event);
  };

  render() {
    const {event} = this.props;
    if (!event)
      return <LoaderComponent />;

    const dateStart = getEventDate(event.dateStart);
    const dateEnd = event.dateEnd ? getEventDate(event.dateEnd) : null;

    const imageSrc = event.image ? event.image.url() : require('assets/images/event-empty.png');

    return (
      <div styleName="EventCard">
        <div styleName="icon-img"
             style={{backgroundImage: `url(${imageSrc}`}} />

        <div styleName="content">
          <Link to={`/event${event.origin.id}`}>
            <div styleName="title">{event.name}</div>
          </Link>

          {event.description && (
            this.state.expanded ?
              [
                <div key='d'
                     styleName="description">
                  {event.description}
                </div>,
                <div key='e'
                     styleName="expand"
                     onClick={() => this.onExpand(false)}>
                  Свернуть описание
                </div>
              ]
              :
              <div styleName="expand"
                   onClick={() => this.onExpand(true)}>
                Показать описание
              </div>
            )
          }

          {event.price ?
            <div styleName="cost">{event.price}</div>
          :
            <div styleName="cost">Бесплатно!</div>
          }

          <div styleName="date">{dateStart}</div>

          {dateEnd &&
            <div styleName="date">{dateEnd}</div>
          }

          {event.ageLimit &&
            <div styleName="date">{event.ageLimit}</div>
          }

          <div styleName="date">{event.place}</div>

          <div styleName="button-wrapper">
            <ButtonControl onClick={this.onJoin}
                           value="Пойду"/>
          </div>
        </div>
      </div>
    );
  }
}