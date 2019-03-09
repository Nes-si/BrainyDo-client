import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CSSModules from 'react-css-modules';
import {Helmet} from "react-helmet";
import {Parse} from 'parse';
import {Link} from 'react-router-dom';

import 'flatpickr/dist/flatpickr.min.css';
import {Russian} from "flatpickr/dist/l10n/ru";
import Flatpickr from 'react-flatpickr';

import {FILE_SIZE_MAX} from 'ConnectConstants';
import {EventData, AGE_LIMITS, AGE_LIMIT_NO_LIMIT} from "models/EventData";
import {showAlert, showModal} from "ducks/nav";
import {createEvent} from "ducks/events";
import {getTextDateTime, convertDataUnits, BYTES, M_BYTES, checkFileType, TYPE_IMAGE, filterSpecials, throttle} from "utils/common";
import {transformDadataAddress} from 'utils/data';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import InputControl from "components/elements/InputControl/InputControl";
import DropdownControl from "components/elements/DropdownControl/DropdownControl";
import CheckboxControl from 'components/elements/CheckboxControl/CheckboxControl';
import LoaderComponent from 'components/elements/LoaderComponent/LoaderComponent';
import GeoSearchControl, {TYPE_ADDRESS} from "components/elements/GeoSearchControl/GeoSearchControl";

import styles from './EventCreateView.sss';



class RightDrag {
  options = new ymaps.option.Manager();
  events = new ymaps.event.Manager();

  mapElm;

  mousePushed = false;
  oldCoords = [0, 0];

  constructor() {
    setTimeout(() => this.mapElm = this.options.get('mapElm'), 1);
  }

  setParent(parent) {
    this.parent = parent;
  }
  getParent() {
    return this.parent;
  }

  enable() {
    this.parent.getMap().events.add('mousedown', this.onDown, this);
    this.parent.getMap().events.add('mousemove', this.onMove, this);
    this.parent.getMap().events.add('mouseup', this.onUp, this);
  }

  disable() {
    this.parent.getMap().events.remove('mousedown', this.onDown, this);
    this.parent.getMap().events.remove('mousemove', this.onMove, this);
    this.parent.getMap().events.remove('mouseup', this.onUp, this);
  }

  onDown = event => {
    if (event.get('which') != 3)
      return;

    this.mousePushed = true;
    this.oldCoords = event.get('globalPixels');
    this.mapElm.style.cursor = 'grab';
  };

  onMove = event => {
    if (this.mousePushed)
      throttle(this.setMapPos, 300)(event);
  };

  setMapPos = event => {
    const coords = event.get('globalPixels');
    const delta = [coords[0] - this.oldCoords[0], coords[1] - this.oldCoords[1]];
    const map = this.parent.getMap();
    const mapCoords = map.getGlobalPixelCenter();
    const mapCoordsNew = [mapCoords[0] - delta[0], mapCoords[1] - delta[1]];
    map.setGlobalPixelCenter(mapCoordsNew);
  };

  onUp = event => {
    this.mousePushed = false;
    this.mapElm.style.cursor = 'default';
  };
}


@CSSModules(styles, {allowMultiple: true})
class EventCreateView extends Component {
  state = {
    name: '',
    description: '',
    dateStart: new Date(),
    dateEnd: new Date(),
    dateEndEnabled: false,
    tags: [],
    price: 0,
    ageLimit: AGE_LIMIT_NO_LIMIT,
    location: null,

    city: null,
    address: null,
    place: null,

    errorRequired: false,

    image: null,
    imageLoading: false,
    imageError: null,

    creating: false
  };

  event = new EventData();
  mapElm = null;
  map = null;
  marker = null;
  geocoder = null;
  placesService = null;


  constructor(props) {
    super(props);

    this.state.dateStart.setDate(this.state.dateStart.getDate() + 1);
    this.state.dateStart.setHours(18, 0, 0, 0);

    this.state.dateEnd.setDate(this.state.dateEnd.getDate() + 1);
    this.state.dateEnd.setHours(19, 0, 0, 0);

    this.state.city = props.user.userData.location;
  }

  componentDidMount() {
    //ymaps.ready(this.setupYMaps);
    this.setupGMaps();
  }

  componentWillReceiveProps(nextProps) {
    if (this.event.origin && this.event.origin.id)
      this.props.history.push(`/event${this.event.origin.id}`);
  }

  getAddressFromPlaces = aComps => {
    let num;
    let street;
    for (let comp of aComps) {
      switch (comp.types[0]) {
        case 'street_number': num = comp.short_name; break;
        case 'route': street = comp.short_name; break;
      }
    }
    return `${street}, ${num}`;
  };

  setupGMaps = () => {
    let center = {lat: 55.76, lng: 37.64}; // Москва
    const {city} = this.state;
    if (city && city.geoLat && city.geoLon)
      center = {lat: city.geoLat, lng: city.geoLon};

    this.map = new google.maps.Map(this.mapElm, {
      center,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy'
    });

    this.geocoder = new google.maps.Geocoder();

    this.placesService = new google.maps.places.PlacesService(this.map);

    this.map.addListener('click', async event => {
      if (event.placeId) {
        event.stop();

        this.placesService.getDetails({placeId: event.placeId}, (place, status) => {
          if (status != 'OK')
            return;

          this.setMarker(place.geometry.location.lat(), place.geometry.location.lng());
          this.setState({place: place.name});
        });

      } else {
        this.setMarker(event.latLng.lat(), event.latLng.lng());
        this.setState({place: ''});
      }
    });
  };

  setMarker = (lat, lng, setAddress = true) => {
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: {lat, lng},
        map: this.map,
        draggable: true
      });
      this.marker.addListener('dragend', e => {
        this.setState({place: ''});
        this.setAddressByCoords(e.latLng.lat(), e.latLng.lng());
      });

    } else {
      this.marker.setPosition({lat, lng});
    }

    if (setAddress)
      this.setAddressByCoords(lat, lng);
  };

  setAddressByCoords = async (lat, lng) => {
    const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address`;
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
      },
      body: JSON.stringify({
        lat,
        lon: lng
      })
    });

    const resJson = await res.json();
    const address = transformDadataAddress(resJson.suggestions[0]);
    this.setState({address});

    /*
    this.geocoder.geocode({location: {lat, lng}}, (results, status) => {
      if (status != 'OK')
        return;
      console.log(results);
    });
    */
  };

  onChangeName = name => {
    this.setState({name, errorRequired: false});
  };

  onChangeDescription = event => {
    const description = event.target.value;
    this.setState({description});
  };

  onChangePrice = price => {
    this.setState({price});
  };

  onChangeAgeLimit = ageLimit => {
    this.setState({ageLimit});
  };

  onChangeDateStart = _date => {
    const dateStart = _date[0];
    this.setState({dateStart});
  };

  onChangeDateEnd = _date => {
    const dateEnd = _date[0];
    this.setState({dateEnd});
  };

  onChangeDateEndEnabled = dateEndEnabled => {
    this.setState({dateEndEnabled});
  };

  onChangeCity = city => {
    this.setState({city});

    if (city) {
      this.map.setCenter({lat: city.geoLat, lng: city.geoLon});
      this.map.setZoom(11);
    }
  };

  onChangeAddress = address => {
    if (!address)
      return;

    this.setState({address});

    if (address.house) {
      this.map.setCenter({lat: address.geoLat, lng: address.geoLon});
      this.map.setZoom(17);
      this.setMarker(address.geoLat, address.geoLon, false);
    }
  };

  onChangePlace = place => {

  };

  onImageUpload = async event => {
    const file = event.target.files[0];
    if (!file)
      return;

    if (file.size > FILE_SIZE_MAX) {
      const max = convertDataUnits(FILE_SIZE_MAX, BYTES, M_BYTES);
      const size = convertDataUnits(size, BYTES, M_BYTES);
      this.setState({imageError: `Размер файла (${size} ${M_BYTES}) превышает допустимый (${max} ${M_BYTES})!`});
      return;
    }

    if (checkFileType(file.type) != TYPE_IMAGE) {
      this.setState({imageError: `Необходимо выбрать файл с изображением!`});
      return;
    }

    this.setState({imageLoading: true});

    const parseFile = new Parse.File(filterSpecials(file.name), file, file.type);
    await parseFile.save();

    this.setState({imageLoading: false, image: parseFile});
  };

  validate() {
    if (!this.state.name) {
      this.setState({errorRequired: true});
      return false;
    }

    return true;
  }

  onCreate = () => {
    if (!this.validate())
      return;

    this.event.name        = this.state.name;
    this.event.description = this.state.description;
    this.event.dateStart   = this.state.dateStart;
    this.event.dateEnd     = this.state.dateEndEnabled ? this.state.dateEnd : undefined;
    this.event.tags        = this.state.tags;
    this.event.price       = this.state.price;
    this.event.ageLimit    = this.state.ageLimit;
    this.event.image       = this.state.image;
    this.event.owner       = this.props.user.userData;

    const {createEvent} = this.props.eventsActions;
    createEvent(this.event);

    this.setState({creating: true});
  };

  render() {
    const imageSrc = this.state.image ? this.state.image.url() : require('assets/images/event-empty.png');

    return (
      <div styleName="EventCreateView">
        <Helmet>
          <title>Новое событие — Triple L</title>
        </Helmet>

        <div styleName="background"></div>
        <div styleName="header">
          <div styleName="title">Новое событие</div>
        </div>

        <div styleName='content'>
          <div styleName='image-container'>
            <div styleName="image"
                 style={{backgroundImage: `url(${imageSrc}`}} />
            <div styleName="upload-button">
              Загрузить изображение
              <input styleName="upload-hidden"
                     type="file"
                     onChange={this.onImageUpload}/>
            </div>
            {this.state.imageLoading &&
              <div styleName="image-loading">
                <LoaderComponent/>
              </div>
            }
          </div>

          <div styleName="text">
            <div styleName="inline">
              <div>Название:</div>
              <div styleName="input-wrapper">
                <InputControl value={this.state.name}
                              autoFocus
                              red={this.state.errorRequired}
                              onChange={this.onChangeName} />
              </div>
            </div>

            <div styleName="caption">Описание:</div>
            <textarea value={this.state.description}
                      styleName="area-description"
                      onChange={this.onChangeDescription} />

            <div styleName="price-and-age">
              <div styleName="inline">
                <div>Стоимость участия:</div>
                <div styleName="price-input">
                  <InputControl value={this.state.price}
                                onChange={this.onChangePrice} />
                </div>
                <div styleName="price-units">рублей</div>
              </div>

              <div styleName="inline">
                <div>Возрастное ограничение:</div>
                <div styleName="age-dropdown">
                  <DropdownControl list={AGE_LIMITS}
                                   onSuggest={this.onChangeAgeLimit}
                                   current={this.state.ageLimit} />
                </div>
              </div>
            </div>

            <div styleName="date">
              <div styleName="inline">
                <div>Начало:</div>
                <div styleName="date-picker">
                  <Flatpickr value={this.state.dateStart}
                             options={{
                               locale: Russian,
                               formatDate: getTextDateTime,
                               enableTime: true,
                               time_24hr: true
                             }}
                             onChange={this.onChangeDateStart}/>
                </div>
              </div>
              <div styleName="inline">
                <CheckboxControl onChange={this.onChangeDateEndEnabled}
                                 checked={this.state.dateEndEnabled} />
                <div styleName={`date-wrapper ${this.state.dateEndEnabled ? '' : 'date-disabled'}`}>
                  <div>Окончание:</div>
                  <div styleName="date-picker">
                    <Flatpickr value={this.state.dateEnd}
                               options={{
                                 locale: Russian,
                                 formatDate: getTextDateTime,
                                 enableTime: true,
                                 time_24hr: true
                               }}
                               onChange={this.onChangeDateEnd}/>
                  </div>
                </div>
              </div>
            </div>

            <div styleName="location">
              <div styleName="title">Место проведения</div>
              <div styleName="inline top-margin">
                <div>Город:</div>
                <div styleName="input-wrapper">
                  <GeoSearchControl placeholder="Введите первые буквы города"
                                    value={this.state.city ? this.state.city.main : null}
                                    onChange={this.onChangeCity} />
                </div>
              </div>

              <div styleName="inline top-margin">
                <div>Адрес:</div>
                <div styleName="input-wrapper">
                  <GeoSearchControl value={this.state.address ? this.state.address.main : null}
                                    type={TYPE_ADDRESS}
                                    city={this.state.city}
                                    onChange={this.onChangeAddress} />
                </div>
              </div>

              <div styleName="inline top-margin">
                <div>Место:</div>
                <div styleName="input-wrapper">
                  <GeoSearchControl onChange={this.onChangePlace}
                                    value={this.state.place} />
                </div>
              </div>

              <div styleName="map" ref={elm => this.mapElm = elm}></div>
            </div>

            <div styleName="buttons">
              <div styleName="button-wrapper">
                <ButtonControl onClick={this.onCreate}
                               value="Создать событие"/>
              </div>
              <div styleName="button-wrapper">
                <Link to="/dashboard">
                  <ButtonControl color="red"
                                 value="Отмена" />
                </Link>
              </div>
            </div>

            {this.state.errorRequired &&
              <div styleName="error">Необходимо заполнить обязательные поля!</div>
            }

          </div>
        </div>

        {this.state.creating &&
          <div styleName="loader">
            <LoaderComponent/>
          </div>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    events: state.events,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({createEvent}, dispatch),
    navActions:   bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCreateView);