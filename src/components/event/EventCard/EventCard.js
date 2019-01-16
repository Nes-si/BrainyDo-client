import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './EventCard.sss';


@CSSModules(styles, {allowMultiple: true})
export class EventCard extends Component {
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

    return (
      <div styleName="EventCard">
        <div styleName="title">{event.name}</div>

        {this.state.expanded ?
          <div styleName="description">{event.description}</div>
        :
          <div styleName="expand" onClick={() => this.onExpand(true)}>Развернуть</div>
        }

        {event.price ?
          <div styleName="cost">event.price</div>
        :
          <div styleName="cost">Free</div>
        }

        <div styleName="date">{event.date}</div>

        <div styleName="button-wrapper">
          <ButtonControl onClick={this.onJoin}
                         value="Пойду"/>
        </div>
      </div>
    );
  }
}