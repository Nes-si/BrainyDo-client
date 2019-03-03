import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import {prepareLocData} from "utils/data";

import styles from './GeoSearchControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class GeoSearchControl extends Component {
  state = {
    value: '',
    listVis: false
  };
  list = [];

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
      value: data.main,
      listVis: false
    });

    try {
      const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/address`;
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
        },
        body: JSON.stringify({
          query: data.fias
        })
      });

      const resJson = await res.json();
      const resData = resJson.suggestions[0].data;
      data.geoLat = resData.geo_lat;
      data.geoLon = resData.geo_lon;

      this.props.onChange(data);
    } catch (e) {}
  };

  onBlur = () => {
    this.setState({listVis: false});
  };

  onChange = async event => {
    const value = event.target.value;

    this.setState({value});

    try {
      const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`;
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
          "from_bound": {"value": "city"},
          "to_bound": {"value": "settlement"}
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
    );
  }
}