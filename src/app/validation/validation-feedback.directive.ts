import { Directive, ElementRef, HostBinding, OnInit, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Shows Bootstrap validation styling (`is-invalid` / `is-valid`) on every validated field inside a
 * `form.needs-validation`, based on Angular's form state. Bootstrap then shows the field's
 * `.invalid-feedback` or `.valid-feedback` message. A field is styled once it has been touched (left after
 * focusing) or when a submit button marks the whole form as touched.
 */
@Directive({
  selector: '[ngModel]'
})
export class ValidationFeedbackDirective implements OnInit {

  /** Whether this field is in a form that uses validation styling. */
  private active = false;

  constructor(@Self() private control: NgControl, private el: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.active = !!this.el.nativeElement.closest('form.needs-validation');
  }

  @HostBinding('class.is-invalid')
  get showInvalid(): boolean {
    return this.shown() && this.control.invalid;
  }

  @HostBinding('class.is-valid')
  get showValid(): boolean {
    return this.shown() && this.control.valid;
  }

  /** Styled only in validation forms, only for fields that have validators, and only once touched. */
  private shown(): boolean {
    const c = this.control.control;
    return this.active && !!c && !!c.validator && c.touched && c.enabled;
  }
}
