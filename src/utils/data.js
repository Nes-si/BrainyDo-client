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


export function shortLocType(type) {
  switch (type) {
    case 'г': return 'г.';
    case 'с': return 'с.';
    case 'поселок городского типа': return 'ПГТ';
    case 'деревня': return 'дер.';
    case 'хутор': return 'хут.';
    case 'поселок': return 'пос.';
    case 'обл': return 'обл.';
    case 'респ': return 'респ.';
  }
  return type;
}

export function prepareLocData(data) {
  if (data.city && data.settlement)
    return null;

  let main;
  if (data.city)
    main = `${shortLocType(data.city_type)} ${data.city}`;
  else if (data.settlement)
    main = `${shortLocType(data.settlement_type_full)} ${data.settlement}`;

  let details = ``;
  if (data.area)
    details = `${data.area} ${data.area_type}, `;

  if (data.city_with_type != data.region_with_type) {
    const regType = shortLocType(data.region_type);
    if (regType == 'респ.' || regType == 'г.')
      details += `${regType} ${data.region}`;
    else
      details += `${data.region} ${regType}`;
  }

  return {
    main,
    details,
    fias: data.fias_id
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
    return prepareLocData(resJson.location.data);

  } catch (e) {}
}