import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiPaths } from 'src/app/constants/api-endpoints';

/** Base URLs of the backend APIs; the backend address is `apiBaseUrl` in src/environments. */
@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  constructor() { }

  private adminMenuUrl = environment.apiBaseUrl + ApiPaths.ADMIN;
  private clientMenuUrl = environment.apiBaseUrl + ApiPaths.CLIENT;
  private loginUrl = environment.apiBaseUrl + ApiPaths.LOGIN;
  private signupUrl = environment.apiBaseUrl + ApiPaths.SIGNUP;
  private checkSessionUrl = environment.apiBaseUrl + ApiPaths.CHECK_SESSION;
  private carMenuUrl = environment.apiBaseUrl + ApiPaths.CAR;


  /** Base URL for admin operations. */
  public getAdminUrl() {
    return this.adminMenuUrl;
  }

  /** Base URL for client operations. */
  public getClientUrl() {
    return this.clientMenuUrl;
  }

  /** URL for signing in. */
  public getLoginUrl() {
    return this.loginUrl;
  }

  /** URL for signing up. */
  public getSignupUrl() {
    return this.signupUrl;
  }

  /** Base URL for checking whether a sign-in token is still valid; the token and type follow. */
  public getCheckSessionUrl() {
    return this.checkSessionUrl;
  }

  /** Base URL for the public car catalog. */
  public getCarUrl() {
    return this.carMenuUrl;
  }

}
