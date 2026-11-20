import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionExpiredInterceptorService } from './session-expired-interceptor.service';
import { LoginService } from './services/login.service';

describe('SessionExpiredInterceptorService', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let login: LoginService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: SessionExpiredInterceptorService, multi: true }],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    login = TestBed.inject(LoginService);
    spyOn(login, 'sessionExpired');
  });

  afterEach(() => {
    backend.verify();
    sessionStorage.clear();
  });

  /** Sends a GET, answers it with `status`, and reports what the caller saw. */
  function call(url: string, status: number): { error?: HttpErrorResponse; completed: boolean } {
    const seen: { error?: HttpErrorResponse; completed: boolean } = { completed: false };
    http.get(url).subscribe({ error: e => seen.error = e, complete: () => seen.completed = true });
    backend.expectOne(url).flush('', { status, statusText: 'x' });
    return seen;
  }

  it('turns a 401 on an admin or client request into "session expired", without an error for the page', () => {
    login.setClientUser();
    for (const url of ['http://localhost:8080/admin/viewAllCars/tok', 'http://localhost:8080/client/viewMyCars/tok']) {
      const seen = call(url, 401);
      expect(seen.error).toBeUndefined();
      expect(seen.completed).toBe(true);
    }
    expect(login.sessionExpired).toHaveBeenCalledTimes(2);
  });

  it('leaves a 401 from sign-in alone (it means a wrong password)', () => {
    login.setClientUser();
    const seen = call('http://localhost:8080/carSystem/login/?nickname=x', 401);
    expect(seen.error.status).toBe(401);
    expect(login.sessionExpired).not.toHaveBeenCalled();
  });

  it('leaves a 401 alone when nobody is signed in', () => {
    const seen = call('http://localhost:8080/admin/viewAllCars/tok', 401);
    expect(seen.error.status).toBe(401);
    expect(login.sessionExpired).not.toHaveBeenCalled();
  });

  it('passes other errors through to the page', () => {
    login.setAdminUser();
    const seen = call('http://localhost:8080/admin/viewAllCars/tok', 500);
    expect(seen.error.status).toBe(500);
    expect(login.sessionExpired).not.toHaveBeenCalled();
  });
});
