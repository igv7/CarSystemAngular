import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from './admin.service';
import { LoginService } from './login.service';
import { Car } from '../models/car';
import { Client } from '../models/client';

const BASE = 'http://localhost:8080/admin/';

describe('AdminService', () => {
  let service: AdminService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    service = TestBed.inject(AdminService);
    http = TestBed.inject(HttpTestingController);
    TestBed.inject(LoginService).token = 'tok';
  });

  afterEach(() => http.verify());

  /** Expects one request and answers it. */
  const expectCall = (method: string, url: string, body: unknown = {}) => {
    const req = http.expectOne(url);
    expect(req.request.method).toBe(method);
    expect(req.request.withCredentials).toBe(true);
    req.flush(body);
    return req;
  };

  it('puts the token, then the ids, into the path', () => {
    service.getAllCars().subscribe();
    expectCall('GET', BASE + 'viewAllCars/tok', []);
    service.getCar(5).subscribe();
    expectCall('GET', BASE + 'viewCar/tok/5');
    service.deleteClient(7).subscribe();
    expectCall('DELETE', BASE + 'deleteClient/tok/7');
    service.returnCar(3).subscribe();
    expectCall('DELETE', BASE + 'returnCar/tok/3');
    service.getAllClientCarsByPrice(7, 150).subscribe();
    expectCall('GET', BASE + 'viewAllClientCarsByPrice/tok/7/150', []);
    service.getReceiptsByClient(7).subscribe();
    expectCall('GET', BASE + 'viewReceiptsByClient/tok/7', []);
  });

  it('encodes typed-in values in the path', () => {
    service.getCarByNumber('11/1?#').subscribe();
    expectCall('GET', BASE + 'viewCarByNumber/tok/11%2F1%3F%23');
    service.getClientByClientID('123 456').subscribe();
    expectCall('GET', BASE + 'viewClientByClientID/tok/123%20456');
    service.getAllClientCarsByColor(7, 'RED').subscribe();
    expectCall('GET', BASE + 'viewAllClientCarsByColor/tok/7/RED', []);
  });

  it('sends bodies with trimmed strings, keeping the password as typed', () => {
    service.addClient(new Client(undefined, ' John ', 'Smith', 'john_s ', '123456789', '1990-05-17', ' pw ')).subscribe();
    const add = expectCall('POST', BASE + 'addClient/tok');
    expect(add.request.body).toEqual(jasmine.objectContaining({ firstName: 'John', nickname: 'john_s', password: ' pw ' }));

    service.updateCar(new Car(4, ' 444-44-444 ', 'RED', 'AUDI', 1, 10)).subscribe();
    const update = expectCall('PUT', BASE + 'updateCar/tok/4');
    expect(update.request.body.number).toBe('444-44-444');
  });
});
