import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CarService } from './car.service';

describe('CarService', () => {
  let service: CarService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CarService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the public catalog without a token', () => {
    service.getAllCars().subscribe(cars => expect(cars.length).toBe(1));
    http.expectOne('http://localhost:8080/car/viewAllCars').flush([{ id: 1 }]);
  });

  it('loads one brand, encoding the typed text', () => {
    service.getAllCarsByType('AUDI').subscribe();
    http.expectOne('http://localhost:8080/car/viewAllCarsByCarType/AUDI').flush([]);
    service.getAllCarsByType('a/b').subscribe();
    http.expectOne('http://localhost:8080/car/viewAllCarsByCarType/a%2Fb').flush([]);
  });
});
