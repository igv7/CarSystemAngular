import { localTimestamp, redactUrl } from './logger.service';

describe('logger.service helpers', () => {

  describe('redactUrl', () => {
    it('masks password and token query parameters', () => {
      expect(redactUrl('http://x/carSystem/login/?nickname=john&password=s3cret&type=CLIENT'))
        .toBe('http://x/carSystem/login/?nickname=john&password=***&type=CLIENT');
      expect(redactUrl('http://x/a?token=abc&Password=Q')).toBe('http://x/a?token=***&Password=***');
    });

    it('masks the token wherever it appears in the path', () => {
      expect(redactUrl('http://x/admin/viewCar/tok-123/5', 'tok-123')).toBe('http://x/admin/viewCar/***/5');
    });

    it('leaves the URL alone without a token (or with the string "null")', () => {
      expect(redactUrl('http://x/car/viewAllCars')).toBe('http://x/car/viewAllCars');
      expect(redactUrl('http://x/null/a', 'null')).toBe('http://x/null/a');
    });
  });

  describe('localTimestamp', () => {
    it('formats local time as yyyy-MM-dd HH:mm:ss.SSS, zero-padded', () => {
      expect(localTimestamp(new Date(2026, 0, 2, 3, 4, 5, 6))).toBe('2026-01-02 03:04:05.006');
      expect(localTimestamp(new Date(2026, 10, 20, 23, 59, 59, 999))).toBe('2026-11-20 23:59:59.999');
    });
  });
});
