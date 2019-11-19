import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router-dom';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './CalendarComponent.sss';



@CSSModules(styles, {allowMultiple: true})
export default class CalendarComponent extends Component {
  state = {
    monthDate: new Date()
  };

  daysInMonth = 0;
  firstDOW = 0;
  weeksInMonth = 0;


  constructor(props) {
    super(props);

    this.state.monthDate.setDate(1);
    this.onChangeMonth(new Date());
  }

  onChangeMonth = monthDate => {
    this.daysInMonth = 32 - new Date(monthDate.getFullYear(), monthDate.getMonth(), 32).getDate();

    const firstDay = new Date(monthDate);
    firstDay.setDate(1);
    this.firstDOW = firstDay.getDay();
    this.firstDOW = this.firstDOW > 0 ? this.firstDOW : 7;

    this.weeksInMonth = Math.ceil((this.daysInMonth + this.firstDOW - 1) / 7);
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

  getCellValue(week, DOW) {
    const value = - (this.firstDOW - 1) + DOW + 7 * (week - 1);
    if (value < 0 || value > this.daysInMonth)
      return 0;
    return value;
  }

  getCells = () => {
    const {onlyOwn, userEvents, userData} = this.props;
    const cells = [];

    for (let week = 1; week <= this.weeksInMonth; week++) {
      const cellsInString = [];

      for (let DOW = 1; DOW <= 7; DOW++) {
        const day = this.getCellValue(week, DOW);
        if (day) {
          cellsInString.push(
            <td key={DOW}>
              <div styleName="day">{day}</div>
              <div styleName="events">
                {userEvents
                  .filter(event => (
                    event.dateStart.getFullYear() == this.state.monthDate.getFullYear() &&
                    event.dateStart.getMonth() == this.state.monthDate.getMonth() &&
                    event.dateStart.getDate() == day &&
                    (!onlyOwn || event.owner.origin.id == userData.origin.id)
                  ))
                  .map(event => {
                    const image = event.image ? event.image.url() : require('assets/images/events/event1.png');

                    return (
                      <Link styleName="event-icon"
                          key={event.origin.id}
                          to={`/event-${event.origin.id}`}
                          title={event.name}
                          style={{backgroundImage: `url(${image})`}} />
                    );
                  })
                }
              </div>
            </td>
          );
        } else {
          cellsInString.push(
            <td key={DOW}></td>
          );
        }
      }
      cells.push(
        <tr key={week}>
          {cellsInString}
        </tr>);
    }
    return cells;
  };

  render() {
    let monthName = this.state.monthDate.toLocaleString('ru', {month: 'long'});
    monthName = monthName[0].toUpperCase() + monthName.slice(1);

    return (
      <div styleName="CalendarComponent">
        {//<div styleName="title">Календарь событий</div>
        }

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

        <table styleName="table">
          <thead>
            <tr>
              <th>ПН</th>
              <th>ВТ</th>
              <th>СР</th>
              <th>ЧТ</th>
              <th>ПТ</th>
              <th>СБ</th>
              <th>ВС</th>
            </tr>
          </thead>
          <tbody>
            {this.getCells()}
          </tbody>
        </table>

      </div>
    );
  }
}