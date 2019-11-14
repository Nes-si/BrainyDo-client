import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import {Russian} from "flatpickr/dist/l10n/ru";
import Flatpickr from 'react-flatpickr';

import {debounce} from 'utils/common';
import {getTextDate} from 'utils/strings';
import {
  FILTER_DATE_OFF, FILTER_DATE_FUTURE, FILTER_DATE_TODAY, FILTER_DATE_TOMORROW, FILTER_DATE_VALUES, FILTER_DATE_WEEK,
  FILTER_DATE_WEEKEND, AGE_LIMIT_NO_LIMIT, AGE_LIMIT_18_PLUS, AGE_LIMIT_18_MINUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_12_MINUS,
  AGE_LIMIT_6_PLUS, AGE_LIMIT_6_MINUS, AGE_LIMITS, FilterEventData
} from 'models/EventData';

import InputControl from "components/elements/InputControl/InputControl";
import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import RadioControl from 'components/elements/RadioControl/RadioControl';
import GeoSearchControl, {TYPE_CITY_AND_REGION} from "components/elements/GeoSearchControl/GeoSearchControl";

import styles from './EventFilterComponent.sss';


const DATE_MAP = new Map();
DATE_MAP.set(FILTER_DATE_FUTURE, "Неважно");
DATE_MAP.set(FILTER_DATE_TODAY, "Сегодня");
DATE_MAP.set(FILTER_DATE_TOMORROW, "Завтра");
DATE_MAP.set(FILTER_DATE_WEEK, "На этой неделе");
DATE_MAP.set(FILTER_DATE_WEEKEND, "На выходных");
DATE_MAP.set(FILTER_DATE_VALUES, "Указать точно");

const PRICE_OFF = 'Неважно';
const PRICE_FREE = 'Только бесплатные';
const PRICE_LESS = 'Не дороже';
const PRICES = [PRICE_OFF, PRICE_FREE, PRICE_LESS];

const AGE_OFF = 'Неважно';
const AGE_MY = 'Для меня';
const AGE_VALUE = 'Выбрать';
let AGES = [AGE_OFF, AGE_MY, AGE_VALUE];

const REGION_OFF = 'Неважно';
const REGION_VALUE = 'Выбрать';
const REGIONS = [REGION_OFF, REGION_VALUE];


@CSSModules(styles, {allowMultiple: true})
export default class EventFilterComponent extends Component {
  state = {
    search: '',

    dateType: FILTER_DATE_FUTURE,
    dateFrom: new Date(),
    dateTo: new Date(),

    priceType: PRICE_OFF,
    price: 0,

    ageType: AGE_OFF,
    ageLimit: AGE_LIMIT_NO_LIMIT,

    regionType: REGION_VALUE,
    region: null,

    tags: []
  };

  filter = new FilterEventData();


  constructor(props) {
    super(props);

    this.filter.date.type = FILTER_DATE_FUTURE;
    if (props.location) {
      this.state.region = props.location;
      this.filter.region.regionData = props.location;
    }
    if (!props.hasAge)
      AGES = [AGE_OFF, AGE_VALUE];
  }

  onChangeSearch = search => {
    this.setState({search});
  };

  onChangeDateType = dateType => {
    this.setState({dateType}, this.onApply);
  };

  onChangeDateFrom = _date => {
    const dateFrom = _date[0];
    this.setState({dateFrom}, this.onApply);
  };

  onChangeDateTo = _date => {
    const dateTo = _date[0];
    this.setState({dateTo}, this.onApply);
  };

  onChangePriceType = priceType => {
    this.setState({priceType}, this.onApply);
  };

  onChangeAgeType = ageType => {
    this.setState({ageType}, this.onApply);
  };

  onChangeAgeLimit = ageLimit => {
    this.setState({ageLimit}, this.onApply);
  };

  onChangeRegionType = regionType => {
    this.setState({regionType}, this.onApply);
  };

  onChangeRegion = region => {
    this.setState({region}, this.onApply);
  };

  onTagAdd = tag => {
  };

  onApply = e => {
    if (e)
      e.preventDefault();

    const params = [];
    if (this.state.search)
      params.push(`search=${encodeURIComponent(this.state.search)}`);

    params.push(`dateType=${this.state.dateType}`);
    if (this.state.dateType == FILTER_DATE_VALUES && this.state.dateFrom)
      params.push(`dateFrom=${encodeURIComponent(this.state.dateFrom.toISOString())}`);
    if (this.state.dateType == FILTER_DATE_VALUES && this.state.dateTo)
      params.push(`dateTo=${encodeURIComponent(this.state.dateTo.toISOString())}`);

    if (this.state.priceType == PRICE_FREE)
      params.push(`priceOnlyFree=true`);
    if (this.state.priceType == PRICE_LESS)
      params.push(`priceLessThan=${this.state.price}`);

    if (this.state.ageType == AGE_MY)
      params.push(`ageMy=true`);
    if (this.state.ageType == AGE_VALUE)
      params.push(`ageLimit=${encodeURIComponent(this.state.ageLimit)}`);

    if (this.state.regionType == REGION_VALUE && this.state.region) {
      if (this.state.region.cityFias)
        params.push(`cityFias=${this.state.region.cityFias}`);
      else if (this.state.region.regionFias)
        params.push(`regionFias=${this.state.region.regionFias}`);
    }

    let paramsStr;
    if (params.length) {
      paramsStr = '?' + params.join('&');
      this.props.onApply(paramsStr);
    }
  };

  debouncedApply = debounce(this.onApply, 1000);
  onChangePrice = priceStr => {
    let price = parseInt(priceStr);
    if (!price)
      price = 0;
    this.setState({price}, this.debouncedApply);
  };

  onReset = () => {
    this.setState({
      search: '',
      dateType: FILTER_DATE_FUTURE,
      priceType: PRICE_OFF,
      ageType: AGE_OFF,
      regionType: REGION_OFF
    });

    let paramsStr = `?dateType=${FILTER_DATE_FUTURE}`;
    this.props.onApply(paramsStr);
  };

  render() {
    let dateStyle = 'date-picker';
    if (this.state.dateType != FILTER_DATE_VALUES)
      dateStyle += ' date-disabled';

    return (
      <div styleName="EventFilterComponent">
        <div styleName="title">Фильтр</div>

        <form styleName="search-bar" onSubmit={this.onApply}>
          <div styleName="input-wrapper">
            <InputControl onChange={this.onChangeSearch}
                          value={this.state.search} />
          </div>
          <div styleName="button">
            <ButtonControl value="Поиск"
                           type="submit" />
          </div>
        </form>

        <div styleName="filters">
          <div styleName="filter">
            <div styleName="filter-title">Дата</div>

            <div styleName="radio-group">
              {Array.from(DATE_MAP.keys()).map(dateType =>
                <div key={dateType} styleName="radio-wrapper">
                  <RadioControl name="date-type"
                                data={dateType}
                                value={this.state.dateType}
                                label={DATE_MAP.get(dateType)}
                                onChange={this.onChangeDateType} />
                </div>
              )}
            </div>

            <div styleName="date-group">
              <div styleName="date-component">
                <div styleName="date-title">от:</div>
                <div styleName={dateStyle}>
                  <Flatpickr value={this.state.dateFrom}
                             options={{
                               locale: Russian,
                               formatDate: getTextDate
                             }}
                             onChange={this.onChangeDateFrom} />
                </div>
              </div>
              <div styleName="date-component">
                <div styleName="date-title">до:</div>
                <div styleName={dateStyle}>
                  <Flatpickr value={this.state.dateTo}
                             options={{
                               minDate: this.state.dateFrom,
                               locale: Russian,
                               formatDate: getTextDate
                             }}
                             onChange={this.onChangeDateTo} />
                </div>
              </div>
            </div>
          </div>

          <div styleName="filter">
            <div styleName="filter-title">Стоимость</div>

            <div styleName="radio-group">
              {PRICES.map(priceType =>
                <div key={priceType} styleName="radio-wrapper">
                  <RadioControl name="price-type"
                                data={priceType}
                                value={this.state.priceType}
                                label={priceType}
                                onChange={this.onChangePriceType} />
                </div>
              )}
            </div>

            <div styleName="price">
              <div styleName="price-input">
                <InputControl onChange={this.onChangePrice}
                              readOnly={this.state.priceType != PRICE_LESS}
                              value={this.state.price} />
              </div>
              <div styleName="price-unit">рублей</div>
            </div>
          </div>

          <div styleName="filter">
            <div styleName="filter-title">Возраст</div>

            <div styleName="radio-group">
              {AGES.map(ageType =>
                <div key={ageType} styleName="radio-wrapper">
                  <RadioControl name="age-type"
                                data={ageType}
                                value={this.state.ageType}
                                label={ageType}
                                onChange={this.onChangeAgeType} />
                </div>
              )}
            </div>

            <div styleName="dropdown-wrapper">
              <DropdownControl list={AGE_LIMITS}
                               onSuggest={this.onChangeAgeLimit}
                               disabled={this.state.ageType != AGE_VALUE}
                               current={this.state.ageLimit} />
            </div>

          </div>

          <div styleName="filter">
            <div styleName="filter-title">Регион</div>

            <div styleName="radio-group">
              {REGIONS.map(regionType =>
                <div key={regionType} styleName="radio-wrapper">
                  <RadioControl name="region-type"
                                data={regionType}
                                value={this.state.regionType}
                                label={regionType}
                                onChange={this.onChangeRegionType} />
                </div>
              )}
            </div>

            <div styleName="region">
              <GeoSearchControl type={TYPE_CITY_AND_REGION}
                                onChange={this.onChangeRegion}
                                disabled={this.state.regionType != REGION_VALUE}
                                value={this.state.region ? this.state.region.main : null} />
            </div>
          </div>
        </div>

        <div styleName="buttons">
          <div styleName="button">
            <ButtonControl value="Сбросить фильтр"
                           onClick={this.onReset} />
          </div>
        </div>
      </div>
    );
  }
}