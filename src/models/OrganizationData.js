import {Parse} from 'parse';


export class OrganizationData {
  static get OriginClass() {return Parse.Object.extend("Organization");}

  origin = null;

  name = ``;
  description = ``;
  contactPhone = ``;
  contactEmail = ``;
  address = ``;
  site = ``;
  image = null;
  facebook = ``;
  instagram = ``;
  vk = ``;
  rating = ``;

  //links
  owner = null;

  //children
  members = [];


  setOrigin(origin) {
    this.origin = origin;

    if (origin.get(`name`))         this.name         = origin.get(`name`);
    if (origin.get(`description`))  this.description  = origin.get(`description`);
    if (origin.get(`contactPhone`)) this.contactPhone = origin.get(`contactPhone`);
    if (origin.get(`contactEmail`)) this.contactEmail = origin.get(`contactEmail`);
    if (origin.get(`address`))      this.address      = origin.get(`address`);
    if (origin.get(`site`))         this.site         = origin.get(`site`);
    if (origin.get(`image`))        this.image        = origin.get(`image`);
    if (origin.get(`facebook`))     this.facebook     = origin.get(`facebook`);
    if (origin.get(`instagram`))    this.instagram    = origin.get(`instagram`);
    if (origin.get(`vk`))           this.vk           = origin.get(`vk`);
    if (origin.get(`rating`))       this.rating       = origin.get(`rating`);

    return this;
  }

  updateOrigin() {
    this.origin.set(`name`,         this.name);
    this.origin.set(`description`,  this.description);
    this.origin.set(`contactPhone`, this.contactPhone);
    this.origin.set(`contactEmail`, this.contactEmail);
    this.origin.set(`address`,      this.address);
    this.origin.set(`site`,         this.site);
    this.origin.set(`image`,        this.image);
    this.origin.set(`facebook`,     this.facebook);
    this.origin.set(`instagram`,    this.instagram);
    this.origin.set(`vk`,           this.vk);
    this.origin.set(`rating`,       this.rating);
    if (this.owner)
      this.origin.set(`owner`,      this.owner.origin);
  }
}
