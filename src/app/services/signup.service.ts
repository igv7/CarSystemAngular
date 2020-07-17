import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Client } from '../models/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService) { }

  //Sign Up
  public signUp(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.urlsService.getSignupUrl(), client, {withCredentials: true});

  }
}
