import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ClientType } from 'src/app/models/client-type';

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpTestingController;
  let router: Router;

  /** A fresh service, which reads sessionStorage when it is created. */
  function create(): void {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    service = TestBed.inject(LoginService);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  }

  beforeEach(() => sessionStorage.clear());
  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('starts signed out', () => {
    create();
    expect(service.isLoggedIn).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('restores the sign-in from sessionStorage (a page reload keeps the user signed in)', () => {
    sessionStorage.setItem('token', 'tok');
    sessionStorage.setItem('userAdmin', 'true');
    sessionStorage.setItem('userName', 'admin');
    create();
    expect(service.isLoggedIn).toBe(true);
    expect(service.getAdminUser()).toBe(true);
    expect(service.getClientUser()).toBe(false);
    expect(service.getToken()).toBe('tok');
    expect(service.getUserName()).toBe('admin');
  });

  it('removes sign-in values older versions left in localStorage', () => {
    localStorage.setItem('token', 'old');
    create();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('stores the token, role and nickname in sessionStorage', () => {
    create();
    service.setToken('tok');
    service.setClientUser();
    service.setUserName('john_s');
    expect(sessionStorage.getItem('token')).toBe('tok');
    expect(sessionStorage.getItem('userClient')).toBe('true');
    expect(sessionStorage.getItem('userName')).toBe('john_s');
    expect(service.isLoggedIn).toBe(true);
  });

  it('logout clears everything', () => {
    create();
    service.setToken('tok');
    service.setAdminUser();
    service.setUserName('admin');
    service.logout();
    expect(service.isLoggedIn).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.getUserName()).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('login posts the credentials as encoded query parameters, trimming only the nickname', () => {
    create();
    service.login('  john_s ', 'p&ss= #1', ClientType.CLIENT).subscribe(res => expect(res.body).toBe('tok'));
    const req = http.expectOne(r => r.url.startsWith('http://localhost:8080/carSystem/login/'));
    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe('http://localhost:8080/carSystem/login/?nickname=john_s&password=p%26ss%3D%20%231&type=CLIENT');
    req.flush('tok');
  });

  describe('checkSession', () => {
    beforeEach(() => {
      sessionStorage.setItem('token', 'tok');
      sessionStorage.setItem('userClient', 'true');
      create();
    });

    const check = () => {
      let active: boolean;
      service.checkSession(ClientType.CLIENT).subscribe(a => active = a);
      return { req: http.expectOne('http://localhost:8080/carSystem/checkSession/tok/CLIENT'), active: () => active };
    };

    it('is active when the backend answers', () => {
      const c = check();
      c.req.flush('true');
      expect(c.active()).toBe(true);
    });

    it('has ended when the backend answers 401', () => {
      const c = check();
      c.req.flush('', { status: 401, statusText: 'Unauthorized' });
      expect(c.active()).toBe(false);
    });

    it('counts as active when the backend fails otherwise (it may just be down)', () => {
      const c = check();
      c.req.flush('', { status: 503, statusText: 'Unavailable' });
      expect(c.active()).toBe(true);
    });
  });

  it('checkSession without a token is not active and asks nothing', () => {
    create();
    let active: boolean;
    service.checkSession(ClientType.ADMIN).subscribe(a => active = a);
    expect(active).toBe(false);
  });

  describe('confirmAndSignOut', () => {
    beforeEach(() => {
      create();
      service.setToken('tok');
      service.setAdminUser();
    });

    it('does nothing when the user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      service.confirmAndSignOut();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(service.isLoggedIn).toBe(true);
    });

    it('goes home first and signs out after', async () => {
      spyOn(window, 'confirm').and.returnValue(true);
      service.confirmAndSignOut();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      await Promise.resolve();
      await Promise.resolve();
      expect(service.isLoggedIn).toBe(false);
    });
  });

  it('sessionExpired tells the user once, opens Sign In and signs out', async () => {
    create();
    service.setToken('tok');
    service.setClientUser();
    const alert = spyOn(window, 'alert');

    service.sessionExpired();
    service.sessionExpired(); // a second failed request at the same time

    expect(alert).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    await Promise.resolve();
    await Promise.resolve();
    expect(service.isLoggedIn).toBe(false);
  });

  it('sessionExpired does nothing when nobody is signed in', () => {
    create();
    const alert = spyOn(window, 'alert');
    service.sessionExpired();
    expect(alert).not.toHaveBeenCalled();
  });
});
