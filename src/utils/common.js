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

export function getRandomColor() {
  let red   = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue  = Math.floor(Math.random() * 256);
  return `rgba(${red}, ${green}, ${blue}, 1)`;
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


export const BYTES = `Bytes`;
export const K_BYTES = `KB`;
export const M_BYTES = `MB`;
export const DATA_UNITS = [BYTES, K_BYTES, M_BYTES];

export function convertDataUnits(data, oldUnit, newUnit) {
  switch (newUnit) {
    case BYTES:
      switch (oldUnit) {
        case K_BYTES: data = data * 1024; break;
        case M_BYTES: data = data * 1024 * 1024; break;
      }
      break;
    
    case K_BYTES:
      switch (oldUnit) {
        case BYTES:   data = Math.floor(data / 1024); break;
        case M_BYTES: data = data * 1024; break;
      }
      break;
    
    case M_BYTES:
      switch (oldUnit) {
        case BYTES:   data = Math.floor(data / 1024 / 1024); break;
        case K_BYTES: data = Math.floor(data / 1024); break;
      }
      break;
  }
  return data;
}


export const TYPE_IMAGE   = `Image`;
export const TYPE_TEXT    = `Text`;
export const TYPE_HTML    = `HTML`;
export const TYPE_XML     = `XML`;
export const TYPE_MARKDOWN= `Markdown`;
export const TYPE_JSON    = `JSON`;
export const TYPE_PDF     = `PDF`;
export const TYPE_F_TEXT  = `Formatted text`;
export const TYPE_TABLE   = `Table`;
export const TYPE_PRESENT = `Presentation`;
export const TYPE_AUDIO   = `Audio`;
export const TYPE_VIDEO   = `Video`;
export const TYPE_ARCHIVE = `Archive`;
export const TYPE_EXE     = `Windows program`;
export const TYPE_OTHER   = `Other`;
export const FILE_TYPES = [TYPE_IMAGE, TYPE_TEXT, TYPE_HTML, TYPE_XML, TYPE_MARKDOWN, TYPE_JSON, TYPE_PDF, TYPE_F_TEXT,
  TYPE_TABLE, TYPE_PRESENT, TYPE_AUDIO, TYPE_VIDEO, TYPE_ARCHIVE, TYPE_EXE, TYPE_OTHER];

export function checkFileType(type) {
  if (type.slice(0, 6) == `image/`)
    return TYPE_IMAGE;
  
  else if (type == `text/html`)
    return TYPE_HTML;
  
  else if (type == `text/xml` ||
           type == `application/xml`)
    return TYPE_XML;
  
  else if (type == `text/markdown`)
    return TYPE_MARKDOWN;
  
  else if (type == `application/json`)
    return TYPE_JSON;
    
  else if (type.slice(0, 5) == `text/`)
    return TYPE_TEXT;
  
  else if (type == `application/pdf`)
    return TYPE_PDF;
    
  else if (type == `application/msword` ||
           type == `application/vnd.openxmlformats-officedocument.wordprocessingml.document` ||
           type == `application/vnd.oasis.opendocument.text` ||
           type == `application/x-iwork-pages-sffpages` ||
           type == `application/rtf`)
    return TYPE_F_TEXT;
  
  else if (type == `application/vnd.ms-excel` ||
           type == `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` ||
           type == `application/vnd.oasis.opendocument.spreadsheet` ||
           type == `application/x-iwork-numbers-sffnumbers`)
    return TYPE_TABLE;
  
  else if (type == `application/vnd.ms-powerpoint` ||
           type == `application/vnd.openxmlformats-officedocument.presentationml.presentation` ||
           type == `application/vnd.oasis.opendocument.presentation` ||
           type == `application/x-iwork-keynote-sffkey`)
    return TYPE_PRESENT;
    
  else if (type.slice(0, 6) == `audio/`)
    return TYPE_AUDIO;
    
  else if (type.slice(0, 6) == `video/`)
    return TYPE_VIDEO;
  
  else if (type == `application/zip` ||
           type == `application/gzip` ||
           type == `application/x-7z-compressed` ||
           type == `application/x-rar-compressed` ||
           type == `application/x-tar`)
    return TYPE_ARCHIVE;
  
  else if (type == `application/vnd.microsoft.portable-executable` ||
           type == `application/octet-stream` ||
           type == `application/exe` ||
           type == `application/x-exe`)
    return TYPE_EXE;
  
  return TYPE_OTHER;
}


export function convertObjectToURL(obj) {
  return Object.keys(obj).map(key =>
    key + '=' + encodeURIComponent(obj[key])
  ).join('&');
}

export function JSONPrequest(URL, params) {
  let res, rej;
  const result = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  const node = document.createElement('script');
  node.type = 'text/javascript';
  node.id = (new Date()).getTime() + Math.random();
  node.onerror = () => {
    node.parentNode.removeChild(node);
    rej();
  };
  node.onload = () => node.parentNode.removeChild(node);

  let src = URL + '?';
  if (typeof params == 'string')
    src += ['?', '&'].indexOf(params.substr(0, 1)) > -1  ?  params.substr(1)  :  params;
  else if (typeof params == 'object')
    src += Object.keys(params).map(key =>
      key + '=' + encodeURIComponent(params[key])
    ).join('&');

  const callback = '__jsonp_dynamic_callback_' + node.id.toString().replace('.', '');
  window[callback] = json => {
    res(json);
    delete window[callback];
  };

  node.src = src + (!params ? '' : '&') + 'callback=' + callback;
  document.body.appendChild(node);

  return result;
}

let id = 0;
export function getUniqueId() {
  return id++;
}

export function debounce(func, threshold = 100, execAsap = false) {
  let timeout;

  return function debounced () {
    const obj = this, args = arguments;
    const delayed = () => {
      if (!execAsap)
        func.apply(obj, args);
      timeout = null;
    };

    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);

    timeout = setTimeout(delayed, threshold);
  };
}

export function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;

  return function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  };
}