import { isArray, isEmpty, isNumber, isString, includes, map } from 'lodash';

import { i18n } from '../../layouts/base';

const isNumeric = value => {
  return isNumber(value) || (!isEmpty(value) && !isNaN(value));
};

/* Required */
const required = value => (value ? undefined : `This field is required`);

/* Numeric */
const numeric = value => (isNumeric(value) ? undefined : `Invalid number`);

/* Email */
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? `Invalid email address`
    : undefined;

/* Array of emails */
const emails = value => {
  if (isArray(value) && !isEmpty(value)) {
    return includes(map(value, v => (isString(email(v)) ? false : true)), false)
      ? `Invalid email address`
      : undefined;
  } else {
    return undefined;
  }
};

export { email, emails, numeric, required };
