/** Text without < or >, so no HTML or script can be typed in. */
const NO_HTML = '[^<>]*';

/**
 * Field rules shared by the forms, bound in the templates (`[pattern]="rules.NAME.pattern"`). Keep them in
 * sync with the backend's Car and Client annotations.
 */
export const ValidationRules = {
  /**
   * Nickname, the login (the backend's Constants.NICKNAME_REGEX): Latin letters, digits, '.', '_' and '-',
   * no spaces. Unique ignoring case; the backend checks that. Also used by the Sign In field.
   */
  NICKNAME: { minLength: 3, maxLength: 20, pattern: '[A-Za-z0-9._-]*' },
  /**
   * First and last name (the backend's Constants.PERSON_NAME_REGEX): letters of any language, spaces, hyphens
   * and apostrophes, starting with a letter. A RegExp with the `u` flag, because `\p{L}` (any letter) needs it;
   * Angular's `pattern` takes it as is, so it carries its own ^ and $.
   */
  PERSON_NAME: { minLength: 2, maxLength: 30, pattern: /^\p{L}[\p{L} '\-]*$/u },
  EMAIL: { maxLength: 100, pattern: '[^@\\s<>]+@[^@\\s<>]+\\.[^@\\s<>]+', example: 'name@example.com' },
  PHONE: { pattern: '[0-9]{3}-[0-9]{7}', example: '050-1234567' },
  PASSWORD: { minLength: 4, maxLength: 100 },
  /** Earliest birthday; the latest is today, computed by each form. */
  BIRTHDAY: { min: '1900-01-01' },
  /** Balance an admin can give a client. */
  BALANCE: { min: 0, max: 10000, step: 0.01 },
  /** Balance a new user can start with at sign-up (the backend's MAX_SIGN_UP_BALANCE). */
  SIGN_UP_BALANCE: { min: 0, max: 100, step: 0.01 },
  CAR_NUMBER: { pattern: '[0-9]{3}-[0-9]{2}-[0-9]{3}', example: '123-45-678' },
  /** How many units of a car exist; always 1 at the moment. */
  CAR_AMOUNT: { min: 1, max: 1 },
  CAR_PRICE: { min: 0.01, max: 1000, step: 0.01 },
  /** "Price until" filter: any price from 0. */
  PRICE_FILTER: { min: 0, step: 0.01 },
  /** Client's personal identity number (the backend's Constants.CLIENT_ID_REGEX): exactly 9 digits. */
  CLIENT_ID: { length: 9, pattern: '[0-9]{9}', example: '123456789' },
  /** Client and car ids. */
  ID: { min: 1 },
  /** Brand typed into the car search: letters and spaces only. */
  BRAND_SEARCH: /^[A-Za-z ]+$/,
};
