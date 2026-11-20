import { Directive, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';

/** Whether a mouse button (or a finger, through the browser's emulated mouse events) is pressed. */
let mouseIsDown = false;

/** Fields blurred by a mouse press, whose error stays hidden until that click has finished. */
const blurredByPress = new Set<ValidationFeedbackDirective>();

/** Whether the document-wide mouse listeners are installed; once for all fields. */
let listening = false;

/**
 * Tracks mouse presses for the whole page. Capture phase, so the flag is set before the browser moves the
 * focus (the blur is the mouse-down's default action). After the mouse-up, the click event follows in the
 * same task, so the timeout releases the held-back errors only once the click has been handled.
 */
function listenToMouse(): void {
  if (listening) {
    return;
  }
  listening = true;
  document.addEventListener('mousedown', () => mouseIsDown = true, true);
  document.addEventListener('mouseup', () => {
    mouseIsDown = false;
    if (blurredByPress.size) {
      setTimeout(() => blurredByPress.clear());
    }
  }, true);
}

/**
 * Shows Bootstrap validation styling (`is-invalid` / `is-valid`) on every validated field inside a
 * `form.needs-validation`, based on Angular's form state. Bootstrap then shows the field's
 * `.invalid-feedback` or `.valid-feedback` message. An invalid field is styled once it has been touched (left
 * after focusing) or when a submit button marks the whole form as touched; a valid one see showValid.
 *
 * No feedback line may appear between the mouse-down and the mouse-up of a click: the field is blurred by
 * the mouse-down on a button, a new line pushes the button down, the mouse-up lands outside it, and the
 * click is lost. So "Looks good!" never appears on blur alone, and an error caused by a mouse press waits
 * until the click is over.
 */
@Directive({
  selector: '[ngModel]'
})
export class ValidationFeedbackDirective implements OnInit, OnDestroy {

  /** Whether this field is in a form that uses validation styling. */
  private active = false;

  constructor(@Self() private control: NgControl, private el: ElementRef<HTMLElement>, @Optional() private form: NgForm) { }

  ngOnInit(): void {
    this.active = !!this.el.nativeElement.closest('form.needs-validation');
    if (this.active) {
      listenToMouse();
    }
  }

  ngOnDestroy(): void {
    blurredByPress.delete(this);
  }

  /** A blur that comes from a mouse press holds back this field's error until the click is over. */
  @HostListener('blur')
  onBlur(): void {
    if (this.active && mouseIsDown) {
      blurredByPress.add(this);
    }
  }

  @HostBinding('class.is-invalid')
  get showInvalid(): boolean {
    return this.shown() && this.control.invalid && !blurredByPress.has(this);
  }

  /**
   * "Looks good!" appears while typing (dirty) or after a submit, never just on blur (see the class
   * comment).
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
