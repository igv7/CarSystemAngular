import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _signUpUrl = "http://localhost:4200/signup";
  private _loginUrl = "http://localhost:4200/login";

  // private _signUpUrl = "http://localhost:4200/carSystem/signup";
  // private _loginUrl = "http://localhost:4200/carSystem/login";

  constructor(private http: HttpClient) { }

  signUpUser(user) {
    return this.http.post<any>(this._signUpUrl, user)
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  loggedin() {
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

}
