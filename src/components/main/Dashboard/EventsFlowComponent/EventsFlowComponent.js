import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import EventCard from "components/main/EventsList/EventCard/EventCard";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './EventsFlowComponent.sss';



@CSSModules(styles, {allowMultiple: true})
export default class EventsFlowComponent extends Component {
  state = {
    monthDate: new Date()
  };

  daysInMonth = 0;


  constructor(props) {
    super(props);

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
    const {userEvents, userData, onlyOwn} = this.props;

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
                event.dateStart.getMonth() == this.state.monthDate.getMonth() &&
                (!onlyOwn || event.owner.origin.id == userData.origin.id)
              ))
              .sort((event1, event2) => event1.dateStart > event2.dateStart ? 1 : -1)
              .map(event =>
                <EventCard key={event.origin.id}
                           flow={true}
                           userData={userData}
                           event={event} />
              )
          :
            <div styleName="caption-not-found">События не найдены</div>)
        }
      </div>
    );
  }
}