import { Observable } from 'rxjs';
import { CanDeactivate } from '@angular/router';


/** A component that can ask the user before they leave it. */
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

/** Runs before leaving `/client` and lets the page ask for confirmation. */
export class ExitClientGuardService implements CanDeactivate<ComponentCanDeactivate> {
  /** Asks the component whether the user may leave; allows it when the component has no canDeactivate(). */
  canDeactivate(component: ComponentCanDeactivate) : Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

  constructor() { }
}