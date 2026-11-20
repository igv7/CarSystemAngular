import { UrlsService } from './urls.service';

describe('UrlsService', () => {
  const urls = new UrlsService();

  it('builds every base URL from environment.apiBaseUrl', () => {
    expect(urls.getAdminUrl()).toBe('http://localhost:8080/admin/');
    expect(urls.getClientUrl()).toBe('http://localhost:8080/client/');
    expect(urls.getCarUrl()).toBe('http://localhost:8080/car/');
    expect(urls.getLoginUrl()).toBe('http://localhost:8080/carSystem/login/');
    expect(urls.getSignupUrl()).toBe('http://localhost:8080/carSystem/signUp/');
    expect(urls.getCheckSessionUrl()).toBe('http://localhost:8080/carSystem/checkSession/');
  });
});
