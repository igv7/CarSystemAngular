import { Injectable } from '@angular/core';
import { StorageKeys } from 'src/app/constants/storage-keys';

/**
 * What is left of an older token flow: TokenInterceptorService reads getToken() for its Authorization header.
 * Sign-in itself goes through LoginService.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** The token stored in sessionStorage. */
  getToken() {
    return sessionStorage.getItem(StorageKeys.TOKEN)
  }

}
