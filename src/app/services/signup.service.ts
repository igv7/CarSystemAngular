import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Client } from '../models/client';
import { Observable } from 'rxjs';

/** Registers new client accounts. */
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  public constructor(private httpClient: HttpClient, private urlsService: UrlsService) { }

  //Sign Up
  /** Creates a client account from the sign-up form. */
  public signUp(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.urlsService.getSignupUrl(), client, {withCredentials: true});

  }
}
