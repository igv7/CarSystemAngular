import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignupService } from './signup.service';
import { Client } from '../models/client';

describe('SignupService', () => {
  let service: SignupService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SignupService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts the new client with trimmed fields, except the password', () => {
    service.signUp(new Client(undefined, 'John ', ' Smith', 'john_s', '123456789', '1990-05-17', ' pw ')).subscribe();
    const req = http.expectOne('http://localhost:8080/carSystem/signUp/');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(jasmine.objectContaining({ firstName: 'John', lastName: 'Smith', password: ' pw ' }));
    req.flush({});
  });
});
