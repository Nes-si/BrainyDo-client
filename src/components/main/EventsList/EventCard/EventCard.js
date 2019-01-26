import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import {getEventDateTime} from 'utils/common';
import {isMeEventMember} from 'utils/data';

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

  onLeave = () => {
    const {leaveEvent, event} = this.props;
    leaveEvent(event);
  };

  render() {
    const {event, userData, onTagClick} = this.props;
    if (!event)
      return <LoaderComponent />;

    const dateStart = getEventDateTime(event.dateStart, true);
    const dateEnd = event.dateEnd ? getEventDateTime(event.dateEnd) : null;

    const imageSrc = event.image ? event.image.url() : require('assets/images/event-empty.png');

    const isMember = isMeEventMember(event);

    const isOwner = event.owner.origin.id == userData.origin.id;


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
            <div styleName="cost">{event.price} рублей</div>
          :
            <div styleName="cost">Бесплатно</div>
          }

          {dateEnd ?
            <div styleName="date">{dateStart} — {dateEnd}</div>
          :
            <div styleName="date">{dateStart}</div>
          }

          {event.ageLimit &&
            <div styleName="date">{event.ageLimit}</div>
          }

          <div styleName="date">{event.place}</div>

          {(event.tags && !!event.tags.length) &&
            <div styleName="tags">
              {event.tags.map((tag, i) =>
                <div key={i} styleName="tag" onClick={() => onTagClick(tag)}>{tag}</div>)}
            </div>
          }

          {isOwner ?
            <div styleName="expand">Я создатель события, ёпта</div>
          :
            <div styleName="button-wrapper">
              {isMember ?
                <ButtonControl onClick={this.onLeave}
                               color="red"
                               value="Не пойду"/>
              :
                <ButtonControl onClick={this.onJoin}
                               value="Пойду"/>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}