import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { UrlsService } from './urls.service';
import { Client } from '../models/client';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { ClientReceipt } from '../models/clientReceipt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public constructor(private httpClient: HttpClient, private loginService: LoginService, private urlsService: UrlsService) { }

  //Client Operations
  public addClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.urlsService.getAdminUrl()+"addClient/"+this.loginService.token, client, {withCredentials: true});

  }

  public updateClient(client: Client): Observable<Client> {
    return this.httpClient.put<Client>(this.urlsService.getAdminUrl()+"updateClient/"+this.loginService.token+"/"+client.id, client, {withCredentials: true});
    
  }

  public getClient(id: number): Observable<Client> {
    return this.httpClient.get<Client>(this.urlsService.getAdminUrl()+"viewClient/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  public getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.urlsService.getAdminUrl()+"viewAllClients/"+this.loginService.token, {withCredentials: true});
    
  }

  public deleteClient(id: number): Observable<Client> {
    return this.httpClient.delete<Client>(this.urlsService.getAdminUrl()+"deleteClient/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  //Car Operations
  public addCar(car: Car): Observable<Car> {
    return this.httpClient.post<Car>(this.urlsService.getAdminUrl()+"addCar/"+this.loginService.token, car, {withCredentials: true});

  }

  public updateCar(car: Car): Observable<Car> {
    return this.httpClient.put<Car>(this.urlsService.getAdminUrl()+"updateCar/"+this.loginService.token+"/"+car.id, car, {withCredentials: true});
    
  }

  public getCar(id: number): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  public getCarByNumber(number: string): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewCarByNumber/"+this.loginService.token+"/"+number, {withCredentials: true});
    
  }

  public getAllCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCars/"+this.loginService.token, {withCredentials: true});

  }

  public deleteCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getAdminUrl()+"deleteCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  public getAllCarsByType(type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCarsByCarType/"+this.loginService.token+"/"+type, {withCredentials: true});

  }

  public getAllCarsByColor(color: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllCarsByCarColor/"+this.loginService.token+"/"+color, {withCredentials: true});

  }

  public returnCar(id: number): Observable<Car> {
    return this.httpClient.delete<Car>(this.urlsService.getAdminUrl()+"returnCar/"+this.loginService.token+"/"+id, {withCredentials: true});
    
  }

  //ClientCar Operations
  public getClientCarByNumber(id: number, number: string): Observable<Car> {
    return this.httpClient.get<Car>(this.urlsService.getAdminUrl()+"viewClientCarByNumber/"+this.loginService.token+"/"+id+"/"+number, {withCredentials: true});
    
  }

  public getAllClientCars(id: number): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCars/"+this.loginService.token+"/"+id, {withCredentials: true});

  }

  public getAllClientCarsByType(id: number, type: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByType/"+this.loginService.token+"/"+id+"/"+type, {withCredentials: true});

  }

  public getAllClientCarsByColor(id: number, color: string): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByColor/"+this.loginService.token+"/"+id+"/"+color, {withCredentials: true});

  }

  public getAllClientCarsByPrice(id: number, price: number): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.urlsService.getAdminUrl()+"viewAllClientCarsByPrice/"+this.loginService.token+"/"+id+"/"+price, {withCredentials: true});

  }

  //Receipt Operations
  public getReceiptsByClient(id: number): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getAdminUrl()+"viewReceiptsByClient/"+this.loginService.token+"/"+id, {withCredentials: true});

  }

  public getAllReceipts(): Observable<ClientReceipt[]> {
    return this.httpClient.get<ClientReceipt[]>(this.urlsService.getAdminUrl()+"viewAllReceipts/"+this.loginService.token, {withCredentials: true});

  }


}
