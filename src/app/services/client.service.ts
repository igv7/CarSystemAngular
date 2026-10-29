import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { UrlsService } from './urls.service';
import { ClientApi } from 'src/app/constants/api-endpoints';
import { Car } from '../models/car';
import { Observable } from 'rxjs';
import { ClientReceipt } from '../models/clientReceipt';
import { Client } from '../models/client';

/**
 * Operations for the logged-in client (`/client/...`). Every URL carries the login token as a path segment.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public constructor(private httpClient: HttpClient, private loginService: LoginService, private urlsService: UrlsService) { }

  /** Rents the car with the given id for the logged-in client (backend `addCar`). */
  public getCar(id: number): Observable<Car> {
    return this.httpClient.post<Car>(this.urlsService.getClientUrl()+ClientApi.ADD_CAR+"/"+this.loginService.token+"/"+id, null, {withCredentials: true});

  }

  /** Gets the cars the client can rent. */
  public getCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getClientUrl()+ClientApi.VIEW_CARS+"/"+this.loginService.token, {withCredentials: true});

  }

  /** Gets the cars the client is currently renting. */
  public getMyCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getClientUrl()+ClientApi.VIEW_MY_CARS+"/"+this.loginService.token, {withCredentials: true});

  }

  /** Returns a rented car by id. */
  public returnCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getClientUrl()+ClientApi.RETURN_CAR+"/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  /** Gets the client's rental receipts. */
  public getMyReceipts(): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getClientUrl()+ClientApi.VIEW_MY_RECEIPTS+"/"+this.loginService.token, {withCredentials: true});

  }

  /** Gets the client's account, used for its balance. */
  public getBalance(): Observable<Client> {
    return this.httpClient.get<Client>(this.urlsService.getClientUrl()+ClientApi.VIEW_BALANCE+"/"+this.loginService.token, {withCredentials: true});

  }

  /** Deletes the logged-in client's account. */
  public deleteAccount(): Observable<Client> {
    return this.httpClient.delete<Client>(this.urlsService.getClientUrl()+ClientApi.DELETE_ACCOUNT+"/"+this.loginService.token, {withCredentials: true});

  }

}
