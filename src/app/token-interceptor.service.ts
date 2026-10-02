import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from './services/login.service';

/** Adds an Authorization header to every HTTP request. */
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  /** Copies the request with `Authorization: Bearer <AuthService token>, <LoginService token>`. */
  intercept(req, next) {
    let authService = this.injector.get(AuthService)
    let loginService = this.injector.get(LoginService)
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}, ${loginService.getToken()}`
      }
    })
    return next.handle(tokenizedReq)
  }
}