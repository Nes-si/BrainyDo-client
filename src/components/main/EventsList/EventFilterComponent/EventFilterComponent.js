import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import 'flatpickr/dist/flatpickr.min.css';
import {Russian} from "flatpickr/dist/l10n/ru";
import Flatpickr from 'react-flatpickr';

import {getTextDate} from 'utils/common';
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

  onChangeDateType = dateType => {
    this.setState({dateType});
  };

  onChangeDateFrom = _date => {
    const dateFrom = _date[0];
    this.setState({dateFrom});
  };

  onChangeDateTo = _date => {
    const dateTo = _date[0];
    this.setState({dateTo});
  };

  onChangePriceType = priceType => {
    this.setState({priceType});
  };

  onChangePrice = priceStr => {
    const price = parseInt(priceStr);
    this.setState({price});
  };

  onChangeAgeType = ageType => {
    this.setState({ageType});
  };

  onChangeAgeLimit = ageLimit => {
    this.setState({ageLimit});
  };

  onChangeRegionType = regionType => {
    this.setState({regionType});
  };

  onChangeRegion = region => {
    this.setState({region});
  };

  onTagAdd = tag => {
  };

  onApply = () => {
    this.filter.date.type         = this.state.dateType;
    this.filter.date.greaterThan  = this.state.dateFrom;
    this.filter.date.lessThan     = this.state.dateTo;

    this.filter.price.onlyFree = this.state.priceType == PRICE_FREE;
    this.filter.price.lessThan = this.state.priceType == PRICE_LESS ? this.state.price : undefined;

    this.filter.ageLimit.my = this.state.ageType == AGE_MY;
    this.filter.ageLimit.ageLimit = this.state.ageType == AGE_VALUE ? this.state.ageLimit : undefined;

    this.filter.region.regionData = this.state.regionType == REGION_VALUE ? this.state.region : undefined;

    this.filter.tags = this.state.tags;

    this.props.onApply(this.filter);
  };

  onReset = () => {
    this.setState({
      dateType: FILTER_DATE_FUTURE,
      priceType: PRICE_OFF,
      ageType: AGE_OFF,
      regionType: REGION_OFF
    });

    this.filter = new FilterEventData();
    this.filter.date.type = FILTER_DATE_FUTURE;
    this.props.onApply(this.filter);
  };

  render() {
    let dateStyle = 'date-picker';
    if (this.state.dateType != FILTER_DATE_VALUES)
      dateStyle += ' date-disabled';

    return (
      <div styleName="EventFilterComponent">
        <div styleName="title">Фильтр</div>

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
            <div styleName="filter-title">Возрастное ограничение</div>

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
            <ButtonControl value="Применить"
                           onClick={this.onApply} />
          </div>
          <div styleName="button">
            <ButtonControl value="Сбросить фильтр"
                           onClick={this.onReset} />
          </div>
        </div>
      </div>
    );
  }
}