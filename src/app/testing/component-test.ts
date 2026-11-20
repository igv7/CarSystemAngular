import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CarFilterPipe } from 'src/app/pipes/car-filter.pipe';
import { ClientFilterPipe } from 'src/app/pipes/client-filter.pipe';
import { ClientReceiptFilterPipe } from 'src/app/pipes/client-receipt-filter.pipe';
import { ClientReceiptDateFilterPipe } from 'src/app/pipes/client-receipt-date-filter.pipe';
import { ValidationFeedbackDirective } from 'src/app/validation/validation-feedback.directive';
import { RangeValidatorDirective } from 'src/app/validation/range-validator.directive';
import { MatchesValidatorDirective } from 'src/app/validation/matches-validator.directive';
import { PageMessageComponent } from 'src/app/components/page-message/page-message.component';

/** The pipes, validators and small shared components the templates use, as declared in AppModule. */
export const SHARED_DECLARATIONS = [
  CarFilterPipe, ClientFilterPipe, ClientReceiptFilterPipe, ClientReceiptDateFilterPipe,
  ValidationFeedbackDirective, RangeValidatorDirective, MatchesValidatorDirective, PageMessageComponent,
];

/**
 * Creates one component for a unit test, with what AppModule gives it: HttpClient (the testing backend, so no
 * request leaves the test), the router, template-driven forms and the shared declarations. Child components
 * such as <app-side-menu> are not created (NO_ERRORS_SCHEMA); each has its own spec.
 */
export async function setUpComponent<T>(component: Type<T>): Promise<ComponentFixture<T>> {
  await TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
    declarations: [component, ...SHARED_DECLARATIONS.filter(shared => (shared as Type<unknown>) !== component)],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}
