import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientService } from './client.service';
import { LoginService } from './login.service';

const BASE = 'http://localhost:8080/client/';

describe('ClientService', () => {
  let service: ClientService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    service = TestBed.inject(ClientService);
    http = TestBed.inject(HttpTestingController);
    TestBed.inject(LoginService).token = 'tok';
  });

  afterEach(() => http.verify());

  const expectCall = (method: string, url: string, body: unknown = {}) => {
    const req = http.expectOne(url);
    expect(req.request.method).toBe(method);
    expect(req.request.withCredentials).toBe(true);
    req.flush(body);
  };

  it('calls each client operation with the token in the path', () => {
    service.getCars().subscribe();
    expectCall('GET', BASE + 'viewCars/tok', []);
    service.getMyCars().subscribe();
    expectCall('GET', BASE + 'viewMyCars/tok', []);
    service.getCar(2).subscribe();
    expectCall('POST', BASE + 'addCar/tok/2');
    service.returnCar(2).subscribe();
    expectCall('DELETE', BASE + 'returnCar/tok/2');
    service.getMyReceipts().subscribe();
    expectCall('GET', BASE + 'viewMyReceipts/tok', []);
    service.getBalance().subscribe();
    expectCall('GET', BASE + 'viewBalance/tok', 100 as any);
    service.deleteAccount().subscribe();
    expectCall('DELETE', BASE + 'deleteAccount/tok');
  });
});
