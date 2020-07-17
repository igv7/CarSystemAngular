import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlsService } from './urls.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public isLoggedIn: boolean =false;
  public type: string;

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService) { }


  public token: string = localStorage.getItem("token");
  private userAdmin = JSON.parse(localStorage.getItem("userAdmin") || 'false');
  private userClient = JSON.parse(localStorage.getItem("userClient") || 'false');
  private userName: string = JSON.parse(localStorage.getItem("userName"));

  login(userName, password, type): Observable<any> {
    let url = this.urlsService.getLoginUrl() + '?userName=' + userName + "&password=" + password + "&type=" + type;
    this.isLoggedIn = true;
    console.log(url)
    return this.httpClient.post(url, null, { observe: 'response', responseType: 'text' });
  }

  public logout() {
    localStorage.setItem("token", null);
    this.setAdminUserF();
    this.setClientUserF(); 
    this.isLoggedIn = false;
    // alert("Are You sure You want to exit?");
  }

  // GET&SET token
  public getToken() {
    return this.token;
  }
  public setToken(token: string) {
    this.token = token;
  }


  // GET & SET & SETfalse admin user
  getAdminUser() {
    return this.userAdmin;
  }
  setAdminUser() {
    localStorage.setItem("userAdmin", "true");
    this.userAdmin = true;
  }
  setAdminUserF() {
    localStorage.setItem("userAdmin", "false");
    this.userAdmin = false;
  }


  // GET & SET & SETfalse client user
  getClientUser() {
    return this.userClient;
  }
  setClientUser() {
    localStorage.setItem("userClient", "true");
    this.userClient = true;
  }
  setClientUserF() {
    localStorage.setItem("userClient", "false");
    this.userClient = false;
  }


  // GET user name
  getUserName() {
    return this.userName;
  }




  private _signUpUrl = "http://localhost:4200/signup";
  private _loginUrl = "http://localhost:4200/login";


  signupUser(user) {
    return this.httpClient.post<any>(this._signUpUrl, user)
  }

  loginUser(user) {
    return this.httpClient.post<any>(this._loginUrl, user)
  }

  loggedin() {
    return !!localStorage.getItem('token')
  }
  
}
