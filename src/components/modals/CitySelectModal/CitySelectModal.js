import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ModalContainer from 'components/elements/ModalContainer/ModalContainer';

import styles from './CitySelectModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class CitySelectModal extends Component {
  state = {
    value: '',
    listVis: false,
    confirmed: false
  };
  list = [];


  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  close = () => {
    this.props.onClose();
  };

  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter or Esc pressed
    if (event.keyCode == 13) {
      setTimeout(this.close, 1);
    } else if (event.keyCode == 27) {
      if (this.state.listVis)
        this.setState({listVis: false});
      else
        setTimeout(this.close, 1);
    }
  };

  onItemClick = item => {
    this.setState({
      value: item.main,
      listVis: false,
      confirmed: true
    });
  };

  detect = async () => {
    let URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/detectAddressByIp`;

    const res = await fetch(URL, {
      headers: {
        Accept: "application/json",
        Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
      }
    });

    const resJson = await res.json();
    console.log(resJson);
  };
  
  onBlur = () => {
    this.setState({listVis: false});
  };

  onChange = async event => {
    const value = event.target.value;

    this.setState({value});

    /*
    const res = await JSONPrequest('//kladr-api.ru/api.php', {
      query: value,
      contentType: 'city',
      withParent: 1,
      limit: 15
    });
    */

    this.detect();

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

    const addDot = type => {
      if (type == 'г') return 'г.';
      if (type == 'с') return 'с.';
      if (type == 'обл') return 'обл.';
      if (type == 'респ') return 'респ.';
      return type;
    };

    this.list = [];
    for (let suggestion of suggestions) {
      const {data} = suggestion;

      if (data.city && data.settlement)
        continue;

      let main;
      if (data.city)
        main = `${addDot(data.city_type)} ${data.city}`;
      else if (data.settlement)
        main = `${data.settlement_type_full} ${data.settlement}`;

      let details = ``;
      if (data.area)
        details = `${data.area} ${data.area_type}, `;

      const regType = addDot(data.region_type);
      if (regType == 'респ.')
        details += `${regType} ${data.region}`;
      else
        details += `${data.region} ${regType}`;

      this.list.push({
        main,
        details
      });
    }

    this.setState({
      listVis: !!this.list.length,
      confirmed: false
    });
  };

  render() {
    return (
      <ModalContainer onClose={this.close}>
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
                    <span>{item.main}, </span>
                    <span styleName="item-details">{item.details}</span>
                    <div styleName="ending"></div>
                  </div>
                )}
              </div>
            }
          </div>
        </div>
      </ModalContainer>
    );
  }
}