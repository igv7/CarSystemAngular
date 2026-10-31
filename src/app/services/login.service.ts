import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UrlsService } from './urls.service';
import { LoggerService } from './logger.service';
import { urlPart } from '../validation/sanitize';
import { AppRoutes } from 'src/app/constants/app-routes';
import { StorageKeys } from 'src/app/constants/storage-keys';

/**
 * Sign-in state: the token and which role (admin or client) is signed in, kept in sessionStorage. It survives
 * page reloads, and the browser drops it when the tab or the browser is closed, which signs the user out.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /**
   * Whether an admin or client is signed in. Read from the saved role flags, so it stays correct after a page
   * reload; the header uses it to show Sign In or Sign Out.
   */
  public get isLoggedIn(): boolean {
    return this.userAdmin === true || this.userClient === true;
  }
  /** Not used. */
  public type: string;

  private log = this.logger.for('LoginService');

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService, private logger: LoggerService, private router: Router) {
    // Older versions kept the sign-in in localStorage, where it never expired; remove what they left there.
    [StorageKeys.TOKEN, StorageKeys.USER_ADMIN, StorageKeys.USER_CLIENT, StorageKeys.USER_NAME]
      .forEach(key => localStorage.removeItem(key));
  }


  /** Token returned by the backend at sign-in; added to every API URL. */
  public token: string = sessionStorage.getItem(StorageKeys.TOKEN);
  /** Whether an admin is signed in; checked by AdminGuardService. */
  private userAdmin = JSON.parse(sessionStorage.getItem(StorageKeys.USER_ADMIN) || 'false');
  /** Whether a client is signed in; checked by ClientGuardService. */
  private userClient = JSON.parse(sessionStorage.getItem(StorageKeys.USER_CLIENT) || 'false');
  /** Name the user signed in with, shown in the dashboards' greeting; null when signed out. */
  private userName: string = sessionStorage.getItem(StorageKeys.USER_NAME);

  /** Sends the credentials to the backend. The response body (text) is the token. */
  login(userName, password, type): Observable<any> {
    // Encoded so characters like & + # in a name or password reach the backend unchanged.
    userName = String(userName).trim();
    let url = this.urlsService.getLoginUrl() + '?userName=' + urlPart(userName) + "&password=" + urlPart(password) + "&type=" + urlPart(type);
    this.log.debug(`Sending login request for ${userName} (${type})`);
    return this.httpClient.post(url, null, { observe: 'response', responseType: 'text' });
  }

  /** Clears the token (in memory and in sessionStorage) and both role flags. */
  public logout() {
    sessionStorage.removeItem(StorageKeys.TOKEN);
    this.token = null;
    sessionStorage.removeItem(StorageKeys.USER_NAME);
    this.userName = null;
    this.setAdminUserF();
    this.setClientUserF();
    this.log.info('User logged out');
  }

  /**
   * Sign Out button handler: asks for confirmation, goes to /home, then signs out. Signing out after
   * navigating keeps the admin/client pages' canDeactivate() from asking a second time.
   */
  public confirmAndSignOut(): void {
    if (!confirm("Are you sure you want to sign out?")) {
      this.log.debug('Sign out cancelled');
      return;
    }
    this.router.navigate([AppRoutes.HOME]).then(left => {
      if (left) {
        this.logout();
      }
    });
  }

  /** True while the "session expired" notice is being handled, so parallel failed requests show it only once. */
  private expiring = false;

  /**
   * Called when the backend no longer accepts the token (idle timeout or backend restart): tells the user,
   * opens the sign-in page, then clears the sign-in state. Clearing after navigating keeps the admin/client
   * pages' canDeactivate() from asking "exit?".
   */
  public sessionExpired(): void {
    if (this.expiring || !this.isLoggedIn) {
      return;
    }
    this.expiring = true;
    this.log.info('Session expired on the server; signing out');
    alert("Your session has expired. Please sign in again.");
    this.router.navigate([AppRoutes.LOGIN]).then(() => {
      this.logout();
      this.expiring = false;
    });
  }

  // GET&SET token
  /** The current login token. */
  public getToken() {
    return this.token;
  }
  /** Stores the token returned at sign-in (in memory and in sessionStorage). */
  public setToken(token: string) {
    this.token = token;
    sessionStorage.setItem(StorageKeys.TOKEN, token);
  }


  // GET & SET & SETfalse admin user
  /** Whether an admin is signed in. */
  getAdminUser() {
    return this.userAdmin;
  }
  /** Marks an admin as signed in. */
  setAdminUser() {
    sessionStorage.setItem(StorageKeys.USER_ADMIN, "true");
    this.userAdmin = true;
  }
  /** Marks the admin as signed out. */
  setAdminUserF() {
    sessionStorage.setItem(StorageKeys.USER_ADMIN, "false");
    this.userAdmin = false;
  }


  // GET & SET & SETfalse client user
  /** Whether a client is signed in. */
  getClientUser() {
    return this.userClient;
  }
  /** Marks a client as signed in. */
  setClientUser() {
    sessionStorage.setItem(StorageKeys.USER_CLIENT, "true");
    this.userClient = true;
  }
  /** Marks the client as signed out. */
  setClientUserF() {
    sessionStorage.setItem(StorageKeys.USER_CLIENT, "false");
    this.userClient = false;
  }


  // GET user name
  /** The name the user signed in with, or null if it is not known. */
  getUserName(): string {
    return this.userName;
  }

  /** Remembers the name the user signed in with (in memory and in sessionStorage). */
  setUserName(userName: string): void {
    this.userName = userName;
    sessionStorage.setItem(StorageKeys.USER_NAME, userName);
  }

}
