import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import {getEventDateTime, getMembersNumber} from 'utils/strings';
import {getVisibleMemberName, isMeEventMember} from 'utils/data';

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

  getMembersImgs = () => {
    const {members} = this.props.event;
    if (!members.length)
      return;

    const res = [];
    for (let i = 0; i < members.length && i < 6; i++) {
      let member = members[i];
      const image = member.imageMini ? member.imageMini.url() : require('assets/images/default-avatar-mini.png');

      res.push(<img styleName="member-image"
                    title={getVisibleMemberName(member)}
                    src={image}
                    key={i}/>);
    }

    return res;
  };

  render() {
    const {event, userData, onTagClick, flow} = this.props;
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
          <Link to={`/event-${event.origin.id}`}>
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

          <div styleName="cost">{event.price ? event.price + ' рублей' : 'Бесплатно!'}</div>

          <div styleName="date">{dateStart} {dateEnd ? ' — ' + dateEnd : ''}</div>

          {event.ageLimit &&
            <div styleName="date">{event.ageLimit}</div>
          }

          {event.location &&
            <div styleName="location"><b>{event.locationPlace ? event.locationPlace + ': ' : ''}</b>{event.locationSettlement}, {event.locationAddress}</div>
          }

          {(event.tags && !!event.tags.length) &&
            <div styleName="tags">
              {event.tags.map((tag, i) =>
                <div key={i} styleName="tag" onClick={() => onTagClick(tag)}>{tag}</div>)}
            </div>
          }

          <div styleName="members">
            {getMembersNumber(event.members.length)}:
            {this.getMembersImgs()}
          </div>

          {!flow &&
            (isOwner ?
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
              </div>)
          }
        </div>
      </div>
    );
  }
}