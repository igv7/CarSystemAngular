import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

/** Public car catalog (`/car/...`); needs no login. */
@Injectable({
  providedIn: 'root'
})
export class CarService {

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService) { }

  /** Gets all cars. */
  public getAllCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getCarUrl()+"viewAllCars", {withCredentials: true});

  }

  /** Gets all cars of one brand (a CarType value). */
  public getAllCarsByType(type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getCarUrl()+"viewAllCarsByCarType/"+type, {withCredentials: true});

  }

}
