import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './services/login.service';
import { UrlsService } from './services/urls.service';

/**
 * Signs the user out when the backend rejects their token with 401 on an admin or client request, which
 * happens after 30 minutes without activity or when the backend restarts (sessions live in its memory).
 * The failed request then completes without an error, so pages don't show their own error alert as well.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionExpiredInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService, private urlsService: UrlsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && this.needsSession(req.url) && this.loginService.isLoggedIn) {
        this.loginService.sessionExpired();
        return EMPTY;
      }
      return throwError(err);
    }));
  }

  /** Admin and client requests carry a session token; a 401 from sign-in means a wrong password instead. */
  private needsSession(url: string): boolean {
    return url.startsWith(this.urlsService.getAdminUrl()) || url.startsWith(this.urlsService.getClientUrl());
  }
}
