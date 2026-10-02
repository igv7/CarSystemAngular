import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { UrlsService } from './urls.service';
import { Client } from '../models/client';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { ClientReceipt } from '../models/clientReceipt';

/** Admin operations on the backend (`/admin/...`). Every URL carries the login token as a path segment. */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public constructor(private httpClient: HttpClient, private loginService: LoginService, private urlsService: UrlsService) { }

  //Client Operations
  /** Creates a new client. */
  public addClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.urlsService.getAdminUrl()+"addClient/"+this.loginService.token, client, {withCredentials: true});

  }

  /** Saves changes to an existing client, identified by `client.id`. */
  public updateClient(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.urlsService.getAdminUrl()+"updateClient/"+this.loginService.token+"/"+client.id, client, {withCredentials: true});
    
  }

  /** Gets one client by id. */
  public getClient(id: number): Observable<Client> {
    return this.httpClient.get<Client>(this.urlsService.getAdminUrl()+"viewClient/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  /** Gets all clients. */
  public getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.urlsService.getAdminUrl()+"viewAllClients/"+this.loginService.token, {withCredentials: true});
    
  }

  /** Deletes a client by id. */
  public deleteClient(id: number): Observable<Client> {
    return this.httpClient.delete<Client>(this.urlsService.getAdminUrl()+"deleteClient/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  //Car Operations
  /** Adds a new car to the fleet. */
  public addCar(car: Car): Observable<Car> {
    return this.httpClient.post<Car>(this.urlsService.getAdminUrl()+"addCar/"+this.loginService.token, car, {withCredentials: true});

  }

  /** Saves changes to an existing car, identified by `car.id`. */
  public updateCar(car: Car): Observable<Car> {
    return this.httpClient.put<Car>(this.urlsService.getAdminUrl()+"updateCar/"+this.loginService.token+"/"+car.id, car, {withCredentials: true});
    
  }

  /** Gets one car by id. */
  public getCar(id: number): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  /** Gets one car by its license plate number. */
  public getCarByNumber(number: string): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewCarByNumber/"+this.loginService.token+"/"+number, {withCredentials: true});
    
  }

  /** Gets all cars in the fleet. */
  public getAllCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCars/"+this.loginService.token, {withCredentials: true});

  }

  /** Deletes a car by id. */
  public deleteCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getAdminUrl()+"deleteCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  /** Gets all cars of one brand (a CarType value). */
  public getAllCarsByType(type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCarsByCarType/"+this.loginService.token+"/"+type, {withCredentials: true});

  }

  /** Gets all cars of one color (a CarColor value). */
  public getAllCarsByColor(color: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCarsByCarColor/"+this.loginService.token+"/"+color, {withCredentials: true});

  }

  /** Marks a rented car as returned, on behalf of the client who rented it. */
  public returnCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getAdminUrl()+"returnCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  //ClientCar Operations
  /** Gets a car rented by the given client, by license plate number. */
  public getClientCarByNumber(id: number, number: string): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewClientCarByNumber/"+this.loginService.token+"/"+id+"/"+number, {withCredentials: true});
    
  }

  /** Gets all cars currently rented by the given client. */
  public getAllClientCars(id: number): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCars/"+this.loginService.token+"/"+id, {withCredentials: true});

  }

  /** Gets the given client's rented cars of one brand. */
  public getAllClientCarsByType(id: number, type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByType/"+this.loginService.token+"/"+id+"/"+type, {withCredentials: true});

  }

  /** Gets the given client's rented cars of one color. */
  public getAllClientCarsByColor(id: number, color: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByColor/"+this.loginService.token+"/"+id+"/"+color, {withCredentials: true});

  }

  /** Gets the given client's rented cars priced up to `price`. */
  public getAllClientCarsByPrice(id: number, price: number): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByPrice/"+this.loginService.token+"/"+id+"/"+price, {withCredentials: true});

  }

  //Receipt Operations
  /** Gets all rental receipts of one client. */
  public getReceiptsByClient(id: number): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getAdminUrl()+"viewReceiptsByClient/"+this.loginService.token+"/"+id, {withCredentials: true});

  }

  /** Gets all rental receipts. */
  public getAllReceipts(): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getAdminUrl()+"viewAllReceipts/"+this.loginService.token, {withCredentials: true});

  }


}
