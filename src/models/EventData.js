import {Parse} from 'parse';


export const AGE_LIMIT_NO_LIMIT = `0+`;
export const AGE_LIMIT_6_PLUS = `6+`;
export const AGE_LIMIT_12_PLUS = `12+`;
export const AGE_LIMIT_18_PLUS = `18+`;
export const AGE_LIMIT_6_MINUS = `6–`;
export const AGE_LIMIT_12_MINUS = `12–`;
export const AGE_LIMIT_18_MINUS = `18–`;


export class EventData {
  static get OriginClass() {return Parse.Object.extend("Event");}

  origin = null;

  name = ``;
  description = ``;
  dateStart = null;
  dateEnd = null;
  place = ``;
  image = null;
  ageLimit = AGE_LIMIT_NO_LIMIT;
  price = ``;
  tags = [];


  //links
  owner = null;

  //children
  members = [];


  setOrigin(origin) {
    this.origin = origin;

    if (origin.get(`name`))         this.name         = origin.get(`name`);
    if (origin.get(`description`))  this.description  = origin.get(`description`);
    if (origin.get(`dateStart`))    this.dateStart    = origin.get(`dateStart`);
    if (origin.get(`dateEnd`))      this.dateEnd      = origin.get(`dateEnd`);
    if (origin.get(`place`))        this.place        = origin.get(`place`);
    if (origin.get(`image`))        this.image        = origin.get(`image`);
    if (origin.get(`ageLimit`))     this.ageLimit     = origin.get(`ageLimit`);
    if (origin.get(`price`))        this.price        = origin.get(`price`);
    if (origin.get(`tags`))         this.tags         = origin.get(`tags`);

    return this;
  }

  updateOrigin() {
    this.origin.set(`name`,       this.name);
    this.origin.set(`description`,this.description);
    this.origin.set(`dateStart`,  this.dateStart);
    this.origin.set(`dateEnd`,    this.dateEnd);
    this.origin.set(`place`,      this.place);
    this.origin.set(`image`,      this.image);
    this.origin.set(`ageLimit`,   this.ageLimit);
    this.origin.set(`price`,      this.price);
    this.origin.set(`tags`,       this.tags);
    if (this.owner)
      this.origin.set(`owner`,    this.owner.origin);
  }
}


export class FilterEventData {
  date = {
    greaterThan: null,
    lessThan: null,
    onlyFuture: false,
    onlyPast: false
  };

  ageLimit = {
    age: 0,
    my: false
  };

  price = {
    greaterThan: 0,
    lessThan: Number.MAX_SAFE_INTEGER,
    onlyFree: false
  };

  members = {
    onlyMy: false
  }
}