import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {prepareLocData} from 'utils/data';

import ModalContainer from 'components/elements/ModalContainer/ModalContainer';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';

import styles from './CitySelectModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CitySelectModal extends Component {
  state = {
    value: '',
    listVis: false,
    data: null
  };
  list = [];


  close = () => {
    this.props.onClose();
  };

  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter or Esc pressed
    if (event.keyCode == 13) {
      setTimeout(this.onOK, 1);
    } else if (event.keyCode == 27) {
      if (this.state.listVis)
        this.setState({listVis: false});
      else
        setTimeout(this.close, 1);
    }
  };

  onItemClick = data => {
    this.setState({
      value: data.main,
      listVis: false,
      data
    });
  };

  onBlur = () => {
    this.setState({listVis: false});
  };

  onChange = async event => {
    const value = event.target.value;

    this.setState({value});

    let URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`;

    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
      },
      body: JSON.stringify({
        query: value,
        count: 15,
        locations: [{
          "country": "Россия"
        }],
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    });

    const resJson = await res.json();
    const {suggestions} = resJson;

    this.list = [];
    for (let suggestion of suggestions) {
      const data = prepareLocData(suggestion.data);
      if (data)
        this.list.push(data);
    }

    this.setState({
      listVis: !!this.list.length,
      data: null
    });
  };

  onOK = () => {
    if (!this.state.data)
      return;

    if (this.props.params.callback)
      this.props.params.callback(this.state.data);
    this.close();
  };

  render() {
    return (
      <ModalContainer onClose={this.close} onKeyDown={this.onKeyDown}>
        <div styleName="CitySelectModal">
          <div styleName="title">Выбор города</div>

          <div styleName='input-wrapper' onBlur={this.onBlur}>
            <input styleName="input"
                   placeholder="Введите первые буквы вашего города"
                   value={this.state.value}
                   autoFocus
                   onChange={this.onChange} />
            {this.state.listVis &&
              <div styleName="items">
                {this.list.map((item, key) =>
                  <div onMouseDown={() => this.onItemClick(item)}
                       styleName="item"
                       key={key}>
                    <span>{item.main}</span>
                    {item.details &&
                      <span styleName="item-details">, {item.details}</span>
                    }
                    <div styleName="ending"></div>
                  </div>
                )}
              </div>
            }
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