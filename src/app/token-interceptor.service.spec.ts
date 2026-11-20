import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenInterceptorService } from './token-interceptor.service';
import { LoginService } from './services/login.service';

describe('TokenInterceptorService', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
    sessionStorage.clear();
  });

  it('adds "Bearer null, null" before signing in', () => {
    http.get('/x').subscribe();
    const req = backend.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer null, null');
    req.flush({});
  });

  it('adds the stored and the in-memory token once signed in', () => {
    TestBed.inject(LoginService).setToken('tok');
    http.get('/x').subscribe();
    const req = backend.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok, tok');
    req.flush({});
  });
});
