import { ValidationRules } from './rules';

/**
 * The patterns as the forms use them: Angular's `pattern` validator anchors a string pattern (^...$) and
 * uses a RegExp as is.
 */
function accepts(pattern: string | RegExp, value: string): boolean {
  const regex = typeof pattern === 'string' ? new RegExp(`^(?:${pattern})$`) : pattern;
  return regex.test(value);
}

describe('ValidationRules', () => {

  it('NICKNAME: Latin letters, digits, ".", "_" and "-", no spaces', () => {
    for (const ok of ['john_s', 'dana.l', 'A-1', 'abc']) {
      expect(accepts(ValidationRules.NICKNAME.pattern, ok)).toBe(true, ok);
    }
    for (const bad of ['john smith', 'jöhn', 'a<b', 'x@y']) {
      expect(accepts(ValidationRules.NICKNAME.pattern, bad)).toBe(false, bad);
    }
  });

  it('PERSON_NAME: letters of any language, spaces, hyphens and apostrophes, starting with a letter', () => {
    for (const ok of ['John', 'Игорь', "O'Brien-Lévy", 'Mary Ann', 'יעל']) {
      expect(accepts(ValidationRules.PERSON_NAME.pattern, ok)).toBe(true, ok);
    }
    for (const bad of ['John2', ' John', '-Ann', "'O", 'A<b']) {
      expect(accepts(ValidationRules.PERSON_NAME.pattern, bad)).toBe(false, bad);
    }
  });

  it('EMAIL: one @ and a dot in the domain, no spaces or < >', () => {
    expect(accepts(ValidationRules.EMAIL.pattern, 'name@example.com')).toBe(true);
    for (const bad of ['name@example', 'name example@x.com', 'a@b@c.com', '<a>@b.com']) {
      expect(accepts(ValidationRules.EMAIL.pattern, bad)).toBe(false, bad);
    }
  });

  it('PHONE, CAR_NUMBER and CLIENT_ID: their exact formats', () => {
    expect(accepts(ValidationRules.PHONE.pattern, '050-1234567')).toBe(true);
    expect(accepts(ValidationRules.PHONE.pattern, '0501234567')).toBe(false);
    expect(accepts(ValidationRules.CAR_NUMBER.pattern, '123-45-678')).toBe(true);
    expect(accepts(ValidationRules.CAR_NUMBER.pattern, '12-345-678')).toBe(false);
    expect(accepts(ValidationRules.CLIENT_ID.pattern, '123456789')).toBe(true);
    expect(accepts(ValidationRules.CLIENT_ID.pattern, '12345678')).toBe(false);
    expect(accepts(ValidationRules.CLIENT_ID.pattern, '12345678a')).toBe(false);
  });

  it('BRAND_SEARCH: letters and spaces only', () => {
    expect(ValidationRules.BRAND_SEARCH.test('Mercedes')).toBe(true);
    expect(ValidationRules.BRAND_SEARCH.test('vw golf')).toBe(true);
    expect(ValidationRules.BRAND_SEARCH.test('<script>')).toBe(false);
    expect(ValidationRules.BRAND_SEARCH.test('bmw3')).toBe(false);
  });

  it('keeps the ranges the backend expects', () => {
    expect(ValidationRules.SIGN_UP_BALANCE.max).toBe(100);
    expect(ValidationRules.BALANCE.max).toBe(10000);
    expect(ValidationRules.CAR_PRICE).toEqual(jasmine.objectContaining({ min: 0.01, max: 1000 }));
    expect(ValidationRules.CAR_AMOUNT).toEqual({ min: 1, max: 1 });
  });
});
