import { Injectable } from '@angular/core';

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


  public getAdminUrl() {
    return this.adminMenuUrl;
  }

  public getClientUrl() {
    return this.clientMenuUrl;
  }

  public getLoginUrl() {
    return this.loginUrl;
  }

  public getSignupUrl() {
    return this.signupUrl;
  }

  public getCarUrl() {
    return this.carMenuUrl;
  }

}
