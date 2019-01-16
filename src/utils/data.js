import {AGE_LIMIT_NO_LIMIT, AGE_LIMIT_6_MINUS, AGE_LIMIT_6_PLUS, AGE_LIMIT_12_MINUS, AGE_LIMIT_12_PLUS, AGE_LIMIT_18_MINUS,
  AGE_LIMIT_18_PLUS} from 'models/EventData';


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
  const limits = [AGE_LIMIT_NO_LIMIT];

  if (age >= 6)   limits.push(AGE_LIMIT_6_PLUS);
  if (age >= 12)  limits.push(AGE_LIMIT_12_PLUS);
  if (age >= 18)  limits.push(AGE_LIMIT_18_PLUS);
  if (age <= 6)   limits.push(AGE_LIMIT_6_MINUS);
  if (age <= 12)  limits.push(AGE_LIMIT_12_MINUS);
  if (age <= 18)  limits.push(AGE_LIMIT_18_MINUS);

  return limits;
}