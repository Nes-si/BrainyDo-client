const locale = navigator.language || navigator.userLanguage;

export function removeOddSpaces(str) {
  if (!str)
    return ``;
  return str.trim().replace(/\s+/g, ` `);
}

export function filterSpecials(str, symb = `_`) {
  if (!str)
    return ``;
  str = removeOddSpaces(str);
  return str.replace(/\W/g, symb);
}

export function filterSpecialsAndCapital(str, symb) {
  str = filterSpecials(str, symb);
  return str.toLowerCase();
}


export function trimFileExt(name) {
  let ind = name.lastIndexOf(`.`);
  if (ind > 0)
    return name.slice(0, ind);
  else
    return name;
}

export function checkURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', `i`); // fragment locator
  return pattern.test(str);
}

export function checkEmail(str) {
  let pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return pattern.test(str);
}


export function parseURLParams(querystring = null) {
  let urlParams = {};

  let pair; // Really a match. Index 0 is the full match; 1 & 2 are the key & val.
  let tokenize = /([^&=]+)=?([^&]*)/g;
  // decodeURIComponents escapes everything but will leave +s that should be ` `
  let reSpace = s => decodeURIComponent(s.replace(/\+/g, ` `));
  // Substring to cut off the leading `?`
  if (!querystring)
    querystring = location.search.substring(1);

  while (pair = tokenize.exec(querystring))
    urlParams[reSpace(pair[1])] = reSpace(pair[2]);

  return urlParams;
}

export function URLEncode(params) {
  return Object
    .keys(params)
    .map(key => encodeURIComponent(key) + `=` + encodeURIComponent(params[key]))
    .join(`&`);
}



export function getTextDate(date) {
  return date.toLocaleString(locale,
    {year: `numeric`, month: `long`, day: `numeric`});
}

export function getTextDateTime(date) {
  return date.toLocaleString(locale,
    {year: `numeric`, month: `long`, day: `numeric`, hour: `numeric`, minute: `numeric`});
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function getRelativeTime(date) {
  let now = new Date();

  let diff = now - date;

  let time = date.toLocaleString(locale, {hour: `numeric`, minute: `numeric`});

  if (diff < MINUTE) {
    if (diff < 10 * SECOND)
      return `Несколько секунд назад`;
    else
      return `Меньше минуты назад`;

  } else if (diff < HOUR) {
    let minutes = Math.floor(diff / MINUTE);
    if (minutes == 1)
      return `Минуту назад`;
    else if (minutes % 10 == 1 && minutes % 100 != 11)
      return `${minutes} минуту назад`;
    else if (minutes <= 4 || (minutes % 10 >= 2 && minutes % 10 <= 4 && minutes % 100 > 20))
      return `${minutes} минуты назад`;
    else
      return `${minutes} минут назад`;

  } else if (now.getDate() == date.getDate() &&
    now.getMonth() == date.getMonth() &&
    now.getFullYear() == date.getFullYear()) {
    return `Сегодня, в ${time}`;

  } else {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (now.getDate() == tomorrow.getDate() &&
      now.getMonth() == tomorrow.getMonth() &&
      now.getFullYear() == tomorrow.getFullYear())
      return `Вчера, в ${time}`;
  }

  return getTextDateTime(date);
}

export function getEventDateTime(date, capitalize) {
  const now = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const diff = date - now;

  const time = date.toLocaleString('ru', {hour: `numeric`, minute: `numeric`});

  let result;

  if (now.getDate() == date.getDate() &&
    now.getMonth() == date.getMonth() &&
    now.getFullYear() == date.getFullYear()) {
    result = `сегодня, в ${time}`;

  } else if (tomorrow.getDate() == date.getDate() &&
    tomorrow.getMonth() == date.getMonth() &&
    tomorrow.getFullYear() == date.getFullYear()) {
    result = `завтра, в ${time}`;

  } else if (diff > 0 && diff < DAY * 6) {
    let DOW = date.toLocaleString('ru', {weekday: 'long'});
    let prefix = `в`;
    if (DOW == 'вторник')
      prefix = `во`;
    if (DOW == 'среда')
      DOW = 'среду';
    else if (DOW == 'пятница')
      DOW = 'пятницу';
    else if (DOW == 'суббота')
      DOW = 'субботу';
    result = `${prefix} ${DOW}, ${time}`;

  } else {
    result = getTextDateTime(date);
  }

  if (capitalize)
    result = result[0].toUpperCase() + result.substring(1);

  return result;
}

export function getMembersNumber(num) {
  const rest = num % 10;
  if (rest == 1)
    return `${num} участник`;
  else if (rest >= 2 && rest <= 4)
    return `${num} участника`;
  else
    return `${num} участников`;
}