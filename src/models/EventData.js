import {Parse} from 'parse';


export const AGE_LIMIT_NO_LIMIT = `0+`;
export const AGE_LIMIT_6_PLUS = `6+`;
export const AGE_LIMIT_12_PLUS = `12+`;
export const AGE_LIMIT_18_PLUS = `18+`;
export const AGE_LIMIT_6_MINUS = `6–`;
export const AGE_LIMIT_12_MINUS = `12–`;
export const AGE_LIMIT_18_MINUS = `18–`;
export const AGE_LIMITS = [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_18_PLUS, AGE_LIMIT_6_MINUS,
  AGE_LIMIT_12_MINUS, AGE_LIMIT_18_MINUS];


export class EventData {
  static get OriginClass() {return Parse.Object.extend("Event");}

  origin = null;

  name = ``;
  description = ``;
  dateStart = null;
  dateEnd = null;
  image = null;
  ageLimit = AGE_LIMIT_NO_LIMIT;
  price = 0;
  tags = [];

  location = null;
  locationRegionFias = ``;
  locationCityFias = ``;
  locationCity = ``;
  locationAddress = ``;
  locationPlace = ``;
  locationDetails = ``;

  //links
  owner = null;

  //children
  members = [];


  constructor(origin) {
    if (origin)
      this.setOrigin(origin);
  }

  setOrigin(origin) {
    this.origin = origin;

    if (origin.get(`name`))         this.name         = origin.get(`name`);
    if (origin.get(`description`))  this.description  = origin.get(`description`);
    if (origin.get(`dateStart`))    this.dateStart    = origin.get(`dateStart`);
    if (origin.get(`dateEnd`))      this.dateEnd      = origin.get(`dateEnd`);
    if (origin.get(`image`))        this.image        = origin.get(`image`);
    if (origin.get(`ageLimit`))     this.ageLimit     = origin.get(`ageLimit`);
    if (origin.get(`price`))        this.price        = origin.get(`price`);
    if (origin.get(`tags`))         this.tags         = origin.get(`tags`);

    if (origin.get(`location`))           this.location           = origin.get(`location`);
    if (origin.get(`locationRegionFias`)) this.locationRegionFias = origin.get(`locationRegionFias`);
    if (origin.get(`locationCityFias`))   this.locationCityFias   = origin.get(`locationCityFias`);
    if (origin.get(`locationCity`))       this.locationCity       = origin.get(`locationCity`);
    if (origin.get(`locationAddress`))    this.locationAddress    = origin.get(`locationAddress`);
    if (origin.get(`locationPlace`))      this.locationPlace      = origin.get(`locationPlace`);
    if (origin.get(`locationDetails`))    this.locationDetails    = origin.get(`locationDetails`);

    return this;
  }

  updateOrigin() {
    if (!this.origin)
      this.origin = new EventData.OriginClass;

    this.origin.set(`name`,       this.name);
    this.origin.set(`description`,this.description);
    this.origin.set(`dateStart`,  this.dateStart);
    this.origin.set(`dateEnd`,    this.dateEnd);
    this.origin.set(`image`,      this.image);
    this.origin.set(`ageLimit`,   this.ageLimit);
    this.origin.set(`price`,      this.price);
    this.origin.set(`tags`,       this.tags);
    if (this.owner)
      this.origin.set(`owner`,    this.owner.origin);

    this.origin.set(`location`,           this.location);
    this.origin.set(`locationRegionFias`, this.locationRegionFias);
    this.origin.set(`locationCityFias`,   this.locationCityFias);
    this.origin.set(`locationCity`,       this.locationCity);
    this.origin.set(`locationAddress`,    this.locationAddress);
    this.origin.set(`locationPlace`,      this.locationPlace);
    this.origin.set(`locationDetails`,    this.locationDetails);
  }
}


export const FILTER_DATE_OFF = "FILTER_DATE_OFF";
export const FILTER_DATE_FUTURE = "FILTER_DATE_FUTURE";
export const FILTER_DATE_TODAY = "FILTER_DATE_TODAY";
export const FILTER_DATE_TOMORROW = "FILTER_DATE_TOMORROW";
export const FILTER_DATE_WEEK = "FILTER_DATE_WEEK";
export const FILTER_DATE_WEEKEND = "FILTER_DATE_WEEKEND";
export const FILTER_DATE_VALUES = "FILTER_DATE_VALUES";


export class FilterEventData {
  search = '';

  date = {
    type: FILTER_DATE_OFF,
    greaterThan: null,
    lessThan: null
  };

  ageLimit = {
    age: undefined,
    my: false,
    ageLimit: undefined
  };

  price = {
    lessThan: undefined,
    onlyFree: false
  };

  region = {
    regionData: undefined
  };

  members = {
    onlyMy: false
  };

  tags = [];
}