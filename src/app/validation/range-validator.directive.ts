import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Enforces the `min` and `max` attributes of number and date inputs in template-driven forms,
 * which Angular 9 does not do by itself. Errors: `{ min: {min, actual} }` or `{ max: {max, actual} }`.
 */
@Directive({
  selector: 'input[type=number][ngModel], input[type=date][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RangeValidatorDirective, multi: true }]
})
export class RangeValidatorDirective implements Validator {

  @Input() min: string | number;
  @Input() max: string | number;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  /** Empty values pass; `required` reports those. Dates are compared as yyyy-MM-dd strings. */
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const isDate = this.el.nativeElement.type === 'date';
    const toComparable = (v: string | number) => isDate ? String(v) : Number(v);
    const actual = toComparable(value);
    if (!isDate && isNaN(actual as number)) {
      return { number: { actual: value } };
    }
    if (this.min !== undefined && this.min !== null && this.min !== '' && actual < toComparable(this.min)) {
      return { min: { min: this.min, actual: value } };
    }
    if (this.max !== undefined && this.max !== null && this.max !== '' && actual > toComparable(this.max)) {
      return { max: { max: this.max, actual: value } };
    }
    return null;
  }
}
