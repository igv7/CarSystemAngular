import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService) { }

  public getAllCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getCarUrl()+"viewAllCars", {withCredentials: true});

  }

  public getAllCarsByType(type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getCarUrl()+"viewAllCarsByCarType/"+type, {withCredentials: true});

  }

}
