import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AdminGuardService } from './admin-guard.service';
import { LoginService } from './login.service';

describe('AdminGuardService', () => {
  let guard: AdminGuardService;
  let login: LoginService;
  let router: Router;
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/admin/view-all-cars' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    guard = TestBed.inject(AdminGuardService);
    login = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('sends a visitor who is not the admin to /login?as=admin', () => {
    spyOn(login, 'getAdminUser').and.returnValue(false);
    expect(guard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { as: 'admin' } });
  });

  it('lets the admin in while the backend still has the session', () => {
    spyOn(login, 'getAdminUser').and.returnValue(true);
    spyOn(login, 'checkSession').and.returnValue(of(true));
    let allowed: boolean;
    (guard.canActivate(route, state) as Observable<boolean>).subscribe(a => allowed = a);
    expect(allowed).toBe(true);
    expect(login.checkSession).toHaveBeenCalledWith('ADMIN' as any);
  });

  it('signs out with the "session expired" notice when the backend no longer has the session', () => {
    spyOn(login, 'getAdminUser').and.returnValue(true);
    spyOn(login, 'checkSession').and.returnValue(of(false));
    spyOn(login, 'sessionExpired');
    let allowed: boolean;
    (guard.canActivate(route, state) as Observable<boolean>).subscribe(a => allowed = a);
    expect(allowed).toBe(false);
    expect(login.sessionExpired).toHaveBeenCalled();
  });
});
