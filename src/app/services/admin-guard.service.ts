import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import { LoggerService } from './logger.service';

/** Lets only a signed-in admin into `/admin`. */
@Injectable({
  providedIn: 'root'
})

export class AdminGuardService implements CanActivate {

  private log = this.logger.for('AdminGuardService');

  constructor(private loginService: LoginService, private router: Router, private logger: LoggerService) { }

  /** Not used. */
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;

  /** Allows the route when an admin is signed in; otherwise logs the attempt and redirects to /login. */
  public canActivate(r: ActivatedRouteSnapshot, s: RouterStateSnapshot): boolean {
    if (this.loginService.getAdminUser() === true) {
      return true;
    }
    else {
      this.log.info(`Access to ${s.url} denied: not logged in as admin, redirecting to /login`);
      this.router.navigate(["/login"]);
      return false;
    }

  }
}
