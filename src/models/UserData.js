import {Parse} from 'parse';


export class UserData {
  origin = null;

  email = ``;
  emailNew = ``;
  nameFirst = ``;
  nameLast = ``;
  image = null;
  sex = `male`;
  birthdate = null;


  constructor(origin) {
    this.setOrigin(origin);
  }

  setOrigin(origin = Parse.User.current()) {
    this.origin = origin;

    if (origin.get(`email`))      this.email      = origin.get(`email`);
      if (!this.email)            this.email      = origin.get(`username`);

    if (origin.get(`emailNew`))   this.emailNew   = origin.get(`emailNew`);
    if (origin.get(`nameFirst`))  this.nameFirst  = origin.get(`nameFirst`);
    if (origin.get(`nameLast`))   this.nameLast   = origin.get(`nameLast`);
    if (origin.get(`image`))      this.image      = origin.get(`image`);
    if (origin.get(`sex`))        this.sex        = origin.get(`sex`);
    if (origin.get(`birthdate`))  this.birthdate  = origin.get(`birthdate`);

    return this;
  }

  updateOrigin() {
    this.origin.set(`nameFirst`,  this.nameFirst);
    this.origin.set(`nameLast`,   this.nameLast);
    this.origin.set(`image`,      this.image);
    this.origin.set(`sex`,        this.sex);
    this.origin.set(`birthdate`,  this.birthdate);
  }

  get age() {
    if (!this.birthdate)
      return 0;

    const ageMs = Date.now() - this.birthdate;
    const ageDate = new Date(ageMs);
    return ageDate.getUTCFullYear() - 1970;
  }

  get emailFiltered () {
    return encodeURIComponent(this.email)
      .replace(/[!'()*.~_-]/g, c =>
        `%` + c.charCodeAt(0).toString(16)
      )
      .replace(/%/g, `_`);
  }
}