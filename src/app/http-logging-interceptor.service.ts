import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService, redactUrl } from './services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class HttpLoggingInterceptorService implements HttpInterceptor {

  private log = this.logger.for('HTTP');

  constructor(private logger: LoggerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    const url = redactUrl(req.urlWithParams, localStorage.getItem('token'));
    this.log.debug(`${req.method} ${url}`);
    return next.handle(req).pipe(tap(
      event => {
        if (event instanceof HttpResponse) {
          this.log.debug(`${req.method} ${url} -> ${event.status} (${Date.now() - started} ms)`);
        }
      },
      (err: HttpErrorResponse) => {
        this.log.error(`${req.method} ${url} -> ${err.status} ${err.statusText} (${Date.now() - started} ms)`);
      }
    ));
  }
}
