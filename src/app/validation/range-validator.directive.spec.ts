import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RangeValidatorDirective } from './range-validator.directive';

/** A directive on an <input> whose type attribute is `typeAttr` and whose type property reads `typeProp`. */
function directiveOn(typeAttr: string, typeProp = typeAttr, min?: string | number, max?: string | number): RangeValidatorDirective {
  const input = document.createElement('input');
  input.setAttribute('type', typeAttr);
  Object.defineProperty(input, 'type', { value: typeProp });
  const directive = new RangeValidatorDirective(new ElementRef(input));
  directive.min = min;
  directive.max = max;
  return directive;
}

const check = (d: RangeValidatorDirective, value: unknown) => d.validate(new FormControl(value));

describe('RangeValidatorDirective', () => {

  it('lets empty values through (required reports those)', () => {
    const d = directiveOn('number', 'number', 1, 10);
    expect(check(d, null)).toBeNull();
    expect(check(d, '')).toBeNull();
    expect(check(d, undefined)).toBeNull();
  });

  describe('number inputs', () => {
    const d = directiveOn('number', 'number', 0.01, 1000);

    it('accepts values in range, including the limits', () => {
      expect(check(d, 0.01)).toBeNull();
      expect(check(d, '500')).toBeNull();
      expect(check(d, 1000)).toBeNull();
    });

    it('reports values below min and above max', () => {
      expect(check(d, 0)).toEqual({ min: { min: 0.01, actual: 0 } });
      expect(check(d, 1000.5)).toEqual({ max: { max: 1000, actual: 1000.5 } });
    });

    it('reports text that is not a number', () => {
      expect(check(d, 'abc')).toEqual({ number: { actual: 'abc' } });
    });
  });

  describe('date inputs', () => {
    it('compares yyyy-MM-dd dates', () => {
      const d = directiveOn('date', 'date', '1900-01-01', '2026-11-20');
      expect(check(d, '1990-05-17')).toBeNull();
      expect(check(d, '1899-12-31')).toEqual({ min: { min: '1900-01-01', actual: '1899-12-31' } });
      expect(check(d, '2999-01-01')).toEqual({ max: { max: '2026-11-20', actual: '2999-01-01' } });
    });

    it('still treats the field as a date in a browser without a date picker (type property "text")', () => {
      const d = directiveOn('date', 'text', '1900-01-01', '2026-11-20');
      expect(check(d, '1990-05-17')).toBeNull();
      expect(check(d, '17/05/1990')).toEqual({ date: { actual: '17/05/1990' } });
    });
  });

  it('writes min and max back as attributes for the browser', () => {
    const d = directiveOn('number', 'number', 1, 10);
    expect(d.minAttr).toBe(1);
    expect(d.maxAttr).toBe(10);
    expect(directiveOn('number').minAttr).toBeNull();
  });
});
