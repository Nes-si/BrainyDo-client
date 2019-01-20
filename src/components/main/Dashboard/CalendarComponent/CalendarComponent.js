import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";

import styles from './CalendarComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CalendarComponent extends Component {
  state = {
    monthDate: null
  };

  now = null;
  daysInMonth = 0;
  firstDOW = 0;
  weeksInMonth = 0;


  constructor(props) {
    super(props);

    this.now = new Date();
    this.state.monthDate = new Date();
    this.state.monthDate.setDate(1);
    this.onChangeMonth(new Date());
  }

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

  onChangeMonth = (monthDate) => {
    this.daysInMonth = 32 - new Date(monthDate.getFullYear(), monthDate.getMonth(), 32).getDate();

    const firstDay = new Date(monthDate);
    firstDay.setDate(1);
    this.firstDOW = firstDay.getDay();
    this.firstDOW = this.firstDOW > 0 ? this.firstDOW : 7;

    this.weeksInMonth = Math.ceil((this.daysInMonth + this.firstDOW - 1) / 7);
  };

  getCellValue(week, DOW) {
    const value = - (this.firstDOW - 1) + DOW + 7 * (week - 1);
    if (value < 0 || value > this.daysInMonth)
      return 0;
    return value;
  }

  render() {
    let monthName = this.state.monthDate.toLocaleString('ru', {month: 'long'});
    monthName = monthName[0].toUpperCase() + monthName.slice(1);

    const cells = [];
    for (let week = 1; week <= this.weeksInMonth; week++) {
      const cellsInString = [];
      for (let DOW = 1; DOW <= 7; DOW++) {
        const day = this.getCellValue(week, DOW);
        if (day)
          cellsInString.push(
            <th key={DOW}>{day}</th>
          );
        else
          cellsInString.push(
            <th key={DOW}></th>
          );
      }
      cells.push(
        <tr key={week}>
          {cellsInString}
        </tr>);
    }

    return (
      <div styleName="CalendarComponent">
        <div styleName="title">Календарь событий</div>

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
          <tr>
            <th>ПН</th>
            <th>ВТ</th>
            <th>СР</th>
            <th>ЧТ</th>
            <th>ПТ</th>
            <th>СБ</th>
            <th>ВС</th>
          </tr>
          {cells}
        </table>

      </div>
    );
  }
}