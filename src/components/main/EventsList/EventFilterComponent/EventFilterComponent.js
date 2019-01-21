import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import DropdownControl from 'components/elements/DropdownControl/DropdownControl';

import styles from './EventFilterComponent.sss';



const DATE_TODAY = "Сегодня";
const DATE_TOMORROW = "Завтра";
const DATES = [DATE_TODAY, DATE_TOMORROW];

@CSSModules(styles, {allowMultiple: true})
export default class EventFilterComponent extends Component {
  state = {
    date: DATE_TODAY
  };

  onChangeDate(date) {
    this.setState({date});
  }

  render() {
    return (
      <div styleName="EventFilterComponent">
        Фильтр
        <div styleName="dropdown-wrapper">
          <DropdownControl  suggestionsList={DATES}
                            suggest={this.onChangeDate}
                            current={this.state.date} />
        </div>
        <div styleName="dropdown-wrapper">
          <DropdownControl  suggestionsList={DATES}
                            suggest={this.onChangeDate}
                            current={this.state.date} />
        </div>
      </div>
    );
  }
}