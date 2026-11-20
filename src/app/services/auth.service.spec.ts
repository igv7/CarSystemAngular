import { AuthService } from './auth.service';

describe('AuthService', () => {
  afterEach(() => sessionStorage.clear());

  it('reads the token from sessionStorage', () => {
    const auth = new AuthService();
    expect(auth.getToken()).toBeNull();
    sessionStorage.setItem('token', 'tok');
    expect(auth.getToken()).toBe('tok');
  });
});
