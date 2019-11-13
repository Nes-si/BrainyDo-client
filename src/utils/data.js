import {Parse} from 'parse';

import {store} from 'index';
import {AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_MINUS, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_MINUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_18_MINUS,
  AGE_LIMIT_18_PLUS} from 'models/EventData';
import {send} from 'utils/server';


export function checkAgeLimit(age, ageLimit) {
  switch (ageLimit) {
    case AGE_LIMIT_6_PLUS:    return age >= 6;
    case AGE_LIMIT_12_PLUS:   return age >= 12;
    case AGE_LIMIT_18_PLUS:   return age >= 18;
    case AGE_LIMIT_6_MINUS:   return age <= 6;
    case AGE_LIMIT_12_MINUS:  return age <= 12;
    case AGE_LIMIT_18_MINUS:  return age <= 18;
  }
  return true;
}

export function getPermissibleAgeLimits(age) {
  const limits = [undefined, '', AGE_LIMIT_NO_LIMIT];

  if (age >= 6)   limits.push(AGE_LIMIT_6_PLUS);
  if (age >= 12)  limits.push(AGE_LIMIT_12_PLUS);
  if (age >= 18)  limits.push(AGE_LIMIT_18_PLUS);
  if (age <= 6)   limits.push(AGE_LIMIT_6_MINUS);
  if (age <= 12)  limits.push(AGE_LIMIT_12_MINUS);
  if (age <= 18)  limits.push(AGE_LIMIT_18_MINUS);

  return limits;
}

export function getAgeLimitsByLimit(ageLimit) {
  switch (ageLimit) {
    case AGE_LIMIT_6_PLUS:    return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS];
    case AGE_LIMIT_12_PLUS:   return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_PLUS];
    case AGE_LIMIT_18_PLUS:   return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_18_PLUS];
    case AGE_LIMIT_6_MINUS:   return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_MINUS];
    case AGE_LIMIT_12_MINUS:  return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_6_MINUS, AGE_LIMIT_12_MINUS];
    case AGE_LIMIT_18_MINUS:  return [AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_6_MINUS, AGE_LIMIT_12_MINUS, AGE_LIMIT_18_MINUS];
  }
  return [AGE_LIMIT_NO_LIMIT];
}

export function checkPassword(password) {
  return send(
    Parse.Cloud.run('checkPassword', {password})
  );
}

export function isMeEventMember(event) {
  const {userEvents} = store.getState().events;
  for (let userEvent of userEvents) {
    if (userEvent.origin.id == event.origin.id)
      return true;
  }
  return false;
}


const shortLocTypes = ['вл', 'г', 'д', 'двлд', 'днп', 'дор', 'дп', 'жт', 'им', 'к', 'кв', 'км', 'комн', 'кп', 'лпх', 'м',
  'мкр', 'наб', 'нп', 'обл', 'оф', 'п', 'пгт', 'пер', 'пл', 'платф', 'респ', 'рзд', 'рп', 'с', 'сл', 'снт', 'ст', 'стр',
  'тер', 'туп', 'ул', 'х', 'ш'];

export function shortLocType(type) {
  switch (type) {
    case 'поселок городского типа': return 'ПГТ';
    case 'деревня': return 'дер.';
    case 'хутор': return 'хут.';
    case 'поселок': return 'пос.';
    case 'городской поселок': return 'г/п';
    case 'рабочий поселок': return 'р/п';
    case 'дачный поселок': return 'д/п';
    case 'территория днт': return 'терр. ДНТ';
    case 'станица': return 'стан.';
    case 'аобл': return 'авт. обл.';
  }

  if (shortLocTypes.indexOf(type) != -1)
    return type + '.';

  return type;
}

export function transformDadataCity(location, includeRegions = false) {
  const {data} = location;

  let city;
  if (data.city)
    city = `${shortLocType(data.city_type)} ${data.city}`;
  else if (data.settlement)
    city = `${shortLocType(data.settlement_type_full)} ${data.settlement}`;

  const area = data.area ? `${data.area} ${data.area_type}` : null;

  let region;
  if (data.city_with_type != data.region_with_type) {
    const regType = shortLocType(data.region_type);
    if (regType == 'респ.' || regType == 'г.')
      region = `${regType} ${data.region}`;
    else
      region = `${data.region} ${regType}`;
  }

  const main = city ? city : region;
  let details = region;
  if (area)
    details = `${area}, ${details}`;

  const sId = data.settlement_fias_id;
  return {
    city,
    area,
    region,
    cityFias: sId ? sId : data.city_fias_id,
    regionFias: data.region_fias_id,
    isSettlement: !!data.settlement,

    main,
    details,
    unrestricted: location.unrestricted_value
  };
}

export function transformDadataAddress(location) {
  const {data} = location;
  const street = `${shortLocType(data.street_type)} ${data.street}`;
  const house = data.house;

  let main = street;
  if (house)
    main += `, ${house}`;

  return {
    street,
    house,
    fias: data.fias_id,

    main,
    unrestricted: location.unrestricted_value
  };
}

export async function detectLocation() {
  const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/detectAddressByIp`;

  try {
    const res = await fetch(URL, {
      headers: {
        Accept: "application/json",
        Authorization: "Token b53aed1c17af2ad242dfec5cb6ab6065ff9789ea"
      }
    });

    const resJson = await res.json();
    return transformDadataCity(resJson.location);

  } catch (e) {}
}


export function getVisibleMemberName(member) {
 return member.nameFirst && member.nameLast ?
    member.nameFirst + ' ' + member.nameLast : (
    member.nameFirst ?
      member.nameFirst : (member.nameLast ? member.nameLast : null));
}