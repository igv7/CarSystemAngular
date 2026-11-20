import { HttpErrorResponse } from '@angular/common/http';
import { serverErrorMessage, trimFields, urlPart } from './sanitize';

describe('sanitize', () => {

  describe('trimFields', () => {
    it('trims every string field except the password, without changing the original', () => {
      const original = { firstName: '  John ', nickname: 'john_s ', password: ' secret ', balance: 100, id: undefined as number };
      const trimmed = trimFields(original);

      expect(trimmed).toEqual({ firstName: 'John', nickname: 'john_s', password: ' secret ', balance: 100, id: undefined });
      expect(original.firstName).toBe('  John ');
    });
  });

  describe('urlPart', () => {
    it('encodes characters that would change a URL', () => {
      expect(urlPart('a/b?c=d&e#f')).toBe('a%2Fb%3Fc%3Dd%26e%23f');
      expect(urlPart('p@ss word+')).toBe('p%40ss%20word%2B');
    });

    it('accepts numbers', () => {
      expect(urlPart(42)).toBe('42');
    });
  });

  describe('serverErrorMessage', () => {
    const error = (body: unknown) => new HttpErrorResponse({ error: body, status: 400 });

    it('returns a text body as is', () => {
      expect(serverErrorMessage(error('Nickname is taken'))).toBe('Nickname is taken');
    });

    it('lists per-field validation errors, one per line', () => {
      expect(serverErrorMessage(error({ errors: { number: 'already exists', price: 'too high' } })))
        .toBe('number: already exists\nprice: too high');
    });

    it('returns the message field of a JSON body', () => {
      expect(serverErrorMessage(error({ message: 'Car 3 is not rented' }))).toBe('Car 3 is not rented');
    });

    it('returns null when the response says nothing useful', () => {
      expect(serverErrorMessage(error(null))).toBeNull();
      expect(serverErrorMessage(error({ status: 500 }))).toBeNull();
      expect(serverErrorMessage(null)).toBeNull();
    });
  });
});
