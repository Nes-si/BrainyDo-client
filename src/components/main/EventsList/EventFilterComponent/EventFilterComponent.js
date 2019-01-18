import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './EventFilterComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class EventFilterComponent extends Component {
  render() {
    return (
      <div styleName="EventFilterComponent">
        Фильтр
      </div>
    );
  }
}