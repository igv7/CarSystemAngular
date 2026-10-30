import { Directive, ElementRef, HostBinding, OnInit, Optional, Self } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';

/**
 * Shows Bootstrap validation styling (`is-invalid` / `is-valid`) on every validated field inside a
 * `form.needs-validation`, based on Angular's form state. Bootstrap then shows the field's
 * `.invalid-feedback` or `.valid-feedback` message. An invalid field is styled once it has been touched (left
 * after focusing) or when a submit button marks the whole form as touched; a valid one see showValid.
 */
@Directive({
  selector: '[ngModel]'
})
export class ValidationFeedbackDirective implements OnInit {

  /** Whether this field is in a form that uses validation styling. */
  private active = false;

  constructor(@Self() private control: NgControl, private el: ElementRef<HTMLElement>, @Optional() private form: NgForm) { }

  ngOnInit(): void {
    this.active = !!this.el.nativeElement.closest('form.needs-validation');
  }

  @HostBinding('class.is-invalid')
  get showInvalid(): boolean {
    return this.shown() && this.control.invalid;
  }

  /**
   * "Looks good!" appears while typing (dirty) or after a submit, never just on blur: a field is blurred by
   * the mouse-down on a button, and a feedback line appearing then pushes the button down before the
   * mouse-up, so the click is lost.
   */
  @HostBinding('class.is-valid')
  get showValid(): boolean {
    const c = this.control.control;
    return this.validated() && this.control.valid && (c.dirty || !!(this.form && this.form.submitted));
  }

  /** Errors are styled only once the field has been touched. */
  private shown(): boolean {
    return this.validated() && this.control.control.touched;
  }

  /** Styled only in validation forms and only for enabled fields that have validators. */
  private validated(): boolean {
    const c = this.control.control;
    return this.active && !!c && !!c.validator && c.enabled;
  }
}
