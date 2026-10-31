import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from './login.service';
import { LoggerService } from './logger.service';
import { AppRoutes, LOGIN_AS_PARAM, LoginAs } from 'src/app/constants/app-routes';
import { ClientType } from 'src/app/models/client-type';

/** Lets only a signed-in client into `/client`. */
@Injectable({
  providedIn: 'root'
})

export class ClientGuardService implements CanActivate {

  private log = this.logger.for('ClientGuardService');

  constructor(private loginService: LoginService, private router: Router, private logger: LoggerService) { }

  /** Not used. */
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;

  /**
   * Allows the route when a client is signed in and the backend still has the session; when the session has
   * expired there, signs out with the "session expired" notice. Otherwise logs the attempt and redirects to /login.
   */
  public canActivate(r: ActivatedRouteSnapshot, s: RouterStateSnapshot): boolean | Observable<boolean> {
    if (this.loginService.getClientUser() === true) {
      return this.loginService.checkSession(ClientType.CLIENT).pipe(map(active => {
        if (!active) {
          this.log.info(`Access to ${s.url} denied: the client session has expired on the server`);
          this.loginService.sessionExpired();
        }
        return active;
      }));
    }
    else {
      this.log.info(`Access to ${s.url} denied: not logged in as client, redirecting to sign in as client`);
      this.router.navigate([AppRoutes.LOGIN], { queryParams: { [LOGIN_AS_PARAM]: LoginAs.CLIENT } });
      return false;
    }

  }

}