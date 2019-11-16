import {DADATA_TOKEN} from "config";

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
        Authorization: `Token ${DADATA_TOKEN}`
      }
    });

    const resJson = await res.json();
    return transformDadataCity(resJson.location);

  } catch (e) {
  }
}