import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {transformDadataCity, transformDadataAddress} from "utils/data";

import styles from './GeoSearchControl.sss';



export const TYPE_CITY = 'TYPE_CITY';
export const TYPE_ADDRESS = 'TYPE_ADDRESS';


@CSSModules(styles, {allowMultiple: true})
export default class GeoSearchControl extends Component {
  state = {
    value: '',
    listVis: false
  };
  list = [];
  type = TYPE_CITY;
  inputElm;


  constructor(props) {
    super(props);

    if (props.value)
      this.state.value = props.value;
    if (props.type)
      this.type = props.type;
  }

  updateValue(value) {
    this.setState({value});
  }

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

  onItemClick = async data => {
    this.setState({
      value: data.main
    });

    if (this.type == TYPE_ADDRESS && !data.house) {
      setTimeout(() => {
        this.onChange(null, this.state.value + ', ');
        this.inputElm.focus();
      }, 1);
    }

    try {
      // узнаём по адресу геокоординаты
      const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`;
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
        },
        body: JSON.stringify({
          query: data.unrestricted,
          count: 1
        })
      });

      const resJson = await res.json();
      const resData = resJson.suggestions[0].data;
      data.geoLat = parseFloat(resData.geo_lat);
      data.geoLon = parseFloat(resData.geo_lon);

      if (this.type != TYPE_ADDRESS || data.house)
        this.props.onChange(data);
    } catch (e) {}
  };

  onBlur = () => {
    this.setState({listVis: false});
  };

  onChange = async (event, value) => {
    if (event)
      value = event.target.value;
    this.setState({value});

    try {
      const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`;
      let queryParams;
      switch (this.type) {
        case TYPE_CITY:
          queryParams = {
            locations: [{
              "country": "Россия"
            }],
            "from_bound": {"value": "city"},
            "to_bound": {"value": "settlement"}
          };
          break;

        case TYPE_ADDRESS:
          queryParams = {
            "from_bound": {"value": "street"},
            "to_bound": {"value": "house"}
          };
          if (this.props.city.isSettlement)
            queryParams.locations = [{
              "settlement_fias_id": this.props.city.fias
            }];
          else
            queryParams.locations = [{
              "city_fias_id": this.props.city.fias
            }];
          break;
      }
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
          ...queryParams
        })
      });

      const resJson = await res.json();
      const {suggestions} = resJson;

      this.list = [];
      for (let suggestion of suggestions) {
        let data;
        switch (this.type) {
          case TYPE_CITY:
            data = transformDadataCity(suggestion);
            break;

          case TYPE_ADDRESS:
            data = transformDadataAddress(suggestion);
            break;
        }
        if (data)
          this.list.push(data);
      }

      this.setState({
        listVis: !!this.list.length
      });

      this.props.onChange(null);
    } catch (e) {}
  };

  render() {
    const {placeholder} = this.props;

    return (
      <div styleName="GeoSearchControl" onBlur={this.onBlur} onKeyDown={this.onKeyDown}>
        <input styleName="input"
               placeholder={placeholder}
               value={this.state.value}
               autoFocus
               ref={elm => this.inputElm = elm}
               onChange={this.onChange} />
        {this.state.listVis &&
          <div styleName="items">
            {this.list.map((item, key) =>
              <div onMouseDown={e => this.onItemClick(item)}
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
    );
  }
}