import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ModalContainer from 'components/elements/ModalContainer/ModalContainer';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import GeoSearchControl from 'components/elements/GeoSearchControl/GeoSearchControl';

import styles from './SettlementSelectModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class SettlementSelectModal extends Component {
  state = {
    data: null
  };

  close = () => {
    this.props.onClose();
  };

  onOK = () => {
    if (!this.state.data)
      return;

    if (this.props.params.callback)
      this.props.params.callback(this.state.data);
    this.close();
  };

  onChange = data => {
    this.setState({data});
  };

  render() {
    return (
      <ModalContainer onClose={this.close}>
        <div styleName="SettlementSelectModal">
          <div styleName="title">Выбор населённого пункта</div>

          <div styleName='search-wrapper'>
            <GeoSearchControl placeholder="Введите первые буквы вашего населённого пункта"
                              sendNull
                              autoFocus
                              onChange={this.onChange} />
          </div>

          <div styleName="button-wrapper">
            <ButtonControl value="ОК"
                           disabled={!this.state.data}
                           onClick={this.onOK} />
            <ButtonControl value="Отмена"
                           color="red"
                           onClick={this.close} />
          </div>
        </div>
      </ModalContainer>
    );
  }
}