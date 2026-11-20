import { FormControl, FormGroup } from '@angular/forms';
import { MatchesValidatorDirective } from './matches-validator.directive';

describe('MatchesValidatorDirective', () => {
  let form: FormGroup;
  let directive: MatchesValidatorDirective;

  beforeEach(() => {
    directive = new MatchesValidatorDirective();
    directive.appMatches = 'password';
    form = new FormGroup({
      password: new FormControl('secret1'),
      pass2: new FormControl('', control => directive.validate(control)),
    });
  });

  afterEach(() => directive.ngOnDestroy());

  it('reports a confirm value that differs from the original', () => {
    form.get('pass2').setValue('secret2');
    expect(form.get('pass2').errors).toEqual({ matches: true });
  });

  it('accepts an equal value', () => {
    form.get('pass2').setValue('secret1');
    expect(form.get('pass2').errors).toBeNull();
  });

  it('re-checks when the original field changes afterwards', () => {
    form.get('pass2').setValue('secret1');
    form.get('password').setValue('changed');
    expect(form.get('pass2').errors).toEqual({ matches: true });

    form.get('password').setValue('secret1');
    expect(form.get('pass2').errors).toBeNull();
  });

  it('does nothing when the named control does not exist', () => {
    directive.appMatches = 'nothing';
    expect(directive.validate(new FormControl('x'))).toBeNull();
  });
});
