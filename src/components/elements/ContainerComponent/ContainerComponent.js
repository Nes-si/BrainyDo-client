import React, {Component} from 'react';
import CSSModules from 'react-css-modules';


import styles from './ContainerComponent.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContainerComponent extends Component {
  render() {
    return (
      <div styleName="ContainerComponent">
        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">{this.props.title}</div>
        </div>
        <div styleName='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}