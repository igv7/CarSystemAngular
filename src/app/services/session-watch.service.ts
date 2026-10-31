import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { LoginService } from './login.service';
import { LoggerService } from './logger.service';
import { ClientType } from 'src/app/models/client-type';
import { SESSION_CHECK_INTERVAL_MS } from 'src/app/constants/session';

/**
 * While someone is signed in, checks on every page that the backend still has their session: when the app
 * starts, every SESSION_CHECK_INTERVAL_MS, and when the tab becomes visible again (browsers slow down timers
 * in hidden tabs). When the session is gone (idle timeout, backend restart, deleted account), signs out with
 * the "session expired" notice. The check does not count as activity, so an idle session still times out.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionWatchService {

  private log = this.logger.for('SessionWatchService');

  private started = false;

  constructor(private loginService: LoginService, private logger: LoggerService) { }

  /** Starts watching. Called once by LayoutComponent; later calls do nothing. */
  public start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.check();
    interval(SESSION_CHECK_INTERVAL_MS).subscribe(() => this.check());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.check();
      }
    });
  }

  /** Checks the session of whoever is signed in; does nothing when nobody is. */
  private check(): void {
    const type = this.loginService.getAdminUser() === true ? ClientType.ADMIN
      : this.loginService.getClientUser() === true ? ClientType.CLIENT
      : null;
    if (!type) {
      return;
    }
    const token = this.loginService.getToken();
    this.loginService.checkSession(type).subscribe(active => {
      // Skip the answer if the user signed out or in again while it was on its way.
      if (!active && this.loginService.getToken() === token) {
        this.log.info(`The ${type} session has expired on the server`);
        this.loginService.sessionExpired();
      }
    });
  }
}
