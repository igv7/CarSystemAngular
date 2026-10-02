import { Injectable } from '@angular/core';

/** Base URLs of the backend APIs; change the backend address here. */
@Injectable({
  providedIn: 'root'
})
export class UrlsService {

  constructor() { }

  private adminMenuUrl = "http://localhost:8080/admin/";
  private clientMenuUrl = "http://localhost:8080/client/";
  private loginUrl = "http://localhost:8080/carSystem/login/";
  private signupUrl = "http://localhost:8080/carSystem/signUp/";
  private carMenuUrl = "http://localhost:8080/car/";


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

  /** Base URL for the public car catalog. */
  public getCarUrl() {
    return this.carMenuUrl;
  }

}
