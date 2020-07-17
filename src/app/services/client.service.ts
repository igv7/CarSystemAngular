import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { UrlsService } from './urls.service';
import { Car } from '../models/car';
import { Observable } from 'rxjs';
import { ClientReceipt } from '../models/clientReceipt';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public constructor(private httpClient: HttpClient, private loginService: LoginService, private urlsService: UrlsService) { }

  public getCar(id: number): Observable<Car> {
    return this.httpClient.post<Car>(this.urlsService.getClientUrl()+"addCar/"+this.loginService.token+"/"+id, {withCredentials: true});

  }

  public getCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getClientUrl()+"viewCars/"+this.loginService.token, {withCredentials: true});

  }

  public getMyCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getClientUrl()+"viewMyCars/"+this.loginService.token, {withCredentials: true});

  }

  public returnCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getClientUrl()+"returnCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  public getMyReceipts(): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getClientUrl()+"viewMyReceipts/"+this.loginService.token, {withCredentials: true});

  }

  public getBalance(): Observable<Client> {
    return this.httpClient.get<Client>(this.urlsService.getClientUrl()+"viewBalance/"+this.loginService.token, {withCredentials: true});

  }

  public deleteAccount(): Observable<Client> {
    return this.httpClient.delete<Client>(this.urlsService.getClientUrl()+"deleteAccount/"+this.loginService.token, {withCredentials: true});

  }

}
