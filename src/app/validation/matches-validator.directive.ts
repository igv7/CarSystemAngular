import { Directive, Input, OnDestroy } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Requires the value to equal another control in the same form, named by `appMatches`
 * (e.g. a "confirm password" field). Error: `{ matches: true }`.
 */
@Directive({
  selector: '[appMatches][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MatchesValidatorDirective, multi: true }]
})
export class MatchesValidatorDirective implements Validator, OnDestroy {

  /** Name of the control this one must match. */
  @Input() appMatches: string;

  /** Re-runs this check when the other control changes, so editing the original field updates the error. */
  private otherChanges: Subscription;

  validate(control: AbstractControl): ValidationErrors | null {
    const other = control.parent && control.parent.get(this.appMatches);
    if (!other) {
      return null;
    }
    if (!this.otherChanges) {
      this.otherChanges = other.valueChanges.subscribe(() => control.updateValueAndValidity({ emitEvent: false }));
    }
    return control.value === other.value ? null : { matches: true };
  }

  ngOnDestroy(): void {
    if (this.otherChanges) {
      this.otherChanges.unsubscribe();
    }
  }
}
