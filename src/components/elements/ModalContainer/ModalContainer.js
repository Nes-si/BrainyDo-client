import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './ModalContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModalContainer extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.props.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.props.onKeyDown);
  }

  render() {
    const {children, onClose} = this.props;

    return (
      <div styleName="ModalContainer" onClick={onClose}>
        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  }
}
