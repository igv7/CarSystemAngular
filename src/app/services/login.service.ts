import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UrlsService } from './urls.service';
import { LoggerService } from './logger.service';

/**
 * Sign-in state: the token and which role (admin or client) is signed in, kept in localStorage so it survives
 * page reloads.
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

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService, private logger: LoggerService, private router: Router) { }


  /** Token returned by the backend at sign-in; added to every API URL. */
  public token: string = localStorage.getItem("token");
  /** Whether an admin is signed in; checked by AdminGuardService. */
  private userAdmin = JSON.parse(localStorage.getItem("userAdmin") || 'false');
  /** Whether a client is signed in; checked by ClientGuardService. */
  private userClient = JSON.parse(localStorage.getItem("userClient") || 'false');
  /** Read from localStorage, but nothing stores it there at the moment. */
  private userName: string = JSON.parse(localStorage.getItem("userName"));

  /** Sends the credentials to the backend. The response body (text) is the token. */
  login(userName, password, type): Observable<any> {
    let url = this.urlsService.getLoginUrl() + '?userName=' + userName + "&password=" + password + "&type=" + type;
    this.log.debug(`Sending login request for ${userName} (${type})`);
    return this.httpClient.post(url, null, { observe: 'response', responseType: 'text' });
  }

  /** Clears the token (in memory and in localStorage) and both role flags. */
  public logout() {
    localStorage.removeItem("token");
    this.token = null;
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
    this.router.navigate(["/home"]).then(left => {
      if (left) {
        this.logout();
      }
    });
  }

  // GET&SET token
  /** The current login token. */
  public getToken() {
    return this.token;
  }
  /** Replaces the current login token (in memory only). */
  public setToken(token: string) {
    this.token = token;
  }


  // GET & SET & SETfalse admin user
  /** Whether an admin is signed in. */
  getAdminUser() {
    return this.userAdmin;
  }
  /** Marks an admin as signed in. */
  setAdminUser() {
    localStorage.setItem("userAdmin", "true");
    this.userAdmin = true;
  }
  /** Marks the admin as signed out. */
  setAdminUserF() {
    localStorage.setItem("userAdmin", "false");
    this.userAdmin = false;
  }


  // GET & SET & SETfalse client user
  /** Whether a client is signed in. */
  getClientUser() {
    return this.userClient;
  }
  /** Marks a client as signed in. */
  setClientUser() {
    localStorage.setItem("userClient", "true");
    this.userClient = true;
  }
  /** Marks the client as signed out. */
  setClientUserF() {
    localStorage.setItem("userClient", "false");
    this.userClient = false;
  }


  // GET user name
  /** The stored user name (currently always null). */
  getUserName() {
    return this.userName;
  }




  /** Old sign-up URL, only used by signupUser(). */
  private _signUpUrl = "http://localhost:4200/signup";
  /** Old sign-in URL, only used by loginUser(). */
  private _loginUrl = "http://localhost:4200/login";


  /** Posts a new user to the old sign-up URL (not used). */
  signupUser(user) {
    return this.httpClient.post<any>(this._signUpUrl, user)
  }

  /** Posts credentials to the old sign-in URL (not used). */
  loginUser(user) {
    return this.httpClient.post<any>(this._loginUrl, user)
  }

  /** Whether a token is stored in localStorage. */
  loggedin() {
    return !!localStorage.getItem('token')
  }
  
}
