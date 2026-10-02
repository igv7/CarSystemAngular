import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Older token-based sign-in flow. Only getToken() is still used, by TokenInterceptorService; sign-in itself
 * goes through LoginService.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _signUpUrl = "http://localhost:4200/signup";
  private _loginUrl = "http://localhost:4200/login";

  // private _signUpUrl = "http://localhost:4200/carSystem/signup";
  // private _loginUrl = "http://localhost:4200/carSystem/login";

  constructor(private http: HttpClient) { }

  /** Posts a new user to the old sign-up URL (not used). */
  signUpUser(user) {
    return this.http.post<any>(this._signUpUrl, user)
  }

  /** Posts credentials to the old sign-in URL (not used). */
  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  /** Whether a token is stored in localStorage. */
  loggedin() {
    return !!localStorage.getItem('token')
  }

  /** The token stored in localStorage. */
  getToken() {
    return localStorage.getItem('token')
  }

}
