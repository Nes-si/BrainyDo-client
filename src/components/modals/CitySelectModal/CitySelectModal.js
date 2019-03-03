import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ModalContainer from 'components/elements/ModalContainer/ModalContainer';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import GeoSearchControl from 'components/elements/GeoSearchControl/GeoSearchControl';

import styles from './CitySelectModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CitySelectModal extends Component {
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
        <div styleName="CitySelectModal">
          <div styleName="title">Выбор города</div>

          <div styleName='search-wrapper'>
            <GeoSearchControl placeholder="Введите первые буквы вашего города"
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