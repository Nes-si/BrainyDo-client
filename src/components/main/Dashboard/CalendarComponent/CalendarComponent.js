import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './CalendarComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CalendarComponent extends Component {
  render() {
    return (
      <div styleName="CalendarComponent">
        Календарь, типа
      </div>
    );
  }
}