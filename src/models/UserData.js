import {Parse} from 'parse';


export class UserData {
  origin = null;
  
  email = "";
  emailNew = "";
  firstName = "";
  lastName = "";
  avatar = null;
  sex = "male";
  StripeId = '';
  
  //links
  payPlan = null;
  
  
  setOrigin(origin = Parse.User.current()) {
    this.origin = origin;
    
    if (origin.get('email'))      this.email      = origin.get('email');
      if (!this.email)            this.email      = origin.get('username');
    
    if (origin.get('emailNew'))   this.emailNew   = origin.get('emailNew');
    if (origin.get('firstName'))  this.firstName  = origin.get('firstName');
    if (origin.get('lastName'))   this.lastName   = origin.get('lastName');
    if (origin.get('avatar'))     this.avatar     = origin.get('avatar');
    if (origin.get('sex'))        this.sex        = origin.get('sex');
    if (origin.get('StripeId'))   this.StripeId   = origin.get('StripeId');

    return this;
  }

  updateOrigin() {
    this.origin.set("firstName",  this.firstName);
    this.origin.set("lastName",   this.lastName);
    this.origin.set("avatar",     this.avatar);
    this.origin.set("sex",        this.sex);
    this.origin.set("StripeId",   this.StripeId);
    if (this.payPlan)
      this.origin.set("payPlan", this.payPlan.origin);
  }
  
  get emailFiltered () {
    return encodeURIComponent(this.email)
      .replace(/[!'()*.~_-]/g, c =>
        '%' + c.charCodeAt(0).toString(16)
      )
      .replace(/%/g, `_`);
  }
}