import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientGuardService } from './client-guard.service';
import { LoginService } from './login.service';

describe('ClientGuardService', () => {
  let guard: ClientGuardService;
  let login: LoginService;
  let router: Router;
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/client/view-my-cars' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    guard = TestBed.inject(ClientGuardService);
    login = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('sends a visitor who is not a client to /login?as=client', () => {
    spyOn(login, 'getClientUser').and.returnValue(false);
    expect(guard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { as: 'client' } });
  });

  it('lets a client in while the backend still has the session', () => {
    spyOn(login, 'getClientUser').and.returnValue(true);
    spyOn(login, 'checkSession').and.returnValue(of(true));
    let allowed: boolean;
    (guard.canActivate(route, state) as Observable<boolean>).subscribe(a => allowed = a);
    expect(allowed).toBe(true);
    expect(login.checkSession).toHaveBeenCalledWith('CLIENT' as any);
  });

  it('signs out with the "session expired" notice when the session has ended', () => {
    spyOn(login, 'getClientUser').and.returnValue(true);
    spyOn(login, 'checkSession').and.returnValue(of(false));
    spyOn(login, 'sessionExpired');
    let allowed: boolean;
    (guard.canActivate(route, state) as Observable<boolean>).subscribe(a => allowed = a);
    expect(allowed).toBe(false);
    expect(login.sessionExpired).toHaveBeenCalled();
  });
});
