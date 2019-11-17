import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import EventCard from "components/main/EventsList/EventCard/EventCard";

import styles from './EventsFlowComponent.sss';
import ButtonControl from "../../../elements/ButtonControl/ButtonControl";



@CSSModules(styles, {allowMultiple: true})
export default class EventsFlowComponent extends Component {
  state = {
    monthDate: null
  };

  now = null;
  daysInMonth = 0;


  constructor(props) {
    super(props);

    this.now = new Date();
    this.state.monthDate = new Date();
    this.state.monthDate.setDate(1);
  }

  onChangeMonth = monthDate => {
    this.daysInMonth = 32 - new Date(monthDate.getFullYear(), monthDate.getMonth(), 32).getDate();
  };

  onPrevMonth = () => {
    const monthDate = new Date(this.state.monthDate);
    monthDate.setMonth(monthDate.getMonth() - 1);
    this.setState({monthDate});
    this.onChangeMonth(monthDate);
  };

  onNextMonth = () => {
    const monthDate = new Date(this.state.monthDate);
    monthDate.setMonth(monthDate.getMonth() + 1);
    this.setState({monthDate});
    this.onChangeMonth(monthDate);
  };

  render() {
    const {userEvents, userData} = this.props;

    let monthName = this.state.monthDate.toLocaleString('ru', {month: 'long'});
    monthName = monthName[0].toUpperCase() + monthName.slice(1);

    return (
      <div styleName="EventsFlowComponent">
        <div styleName="month-control">
          <div styleName="prev">
            <ButtonControl onClick={this.onPrevMonth}
                           value="<" />
          </div>
          <div styleName="month">{monthName}, {this.state.monthDate.getFullYear()}</div>
          <div styleName="next">
            <ButtonControl onClick={this.onNextMonth}
                           value=">" />
          </div>
        </div>

        {
          (!!userEvents.length ?
            userEvents
              .filter(event => (
                event.dateStart.getFullYear() == this.state.monthDate.getFullYear() &&
                event.dateStart.getMonth() == this.state.monthDate.getMonth()) )
              .sort((event1, event2) => {
                if (event1.dateStart > event2.dateStart)
                  return 1;
                return -1;
              })
              .map(event =>
              <EventCard key={event.origin.id}
                         flow={true}
                         userData={userData}
                         event={event} />)
          :
            <div styleName="caption-not-found">События не найдены</div>)
        }
      </div>
    );
  }
}