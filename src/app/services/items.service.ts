import { Injectable } from '@angular/core';

/** Holder for shared objects between components; nothing uses it at the moment. */
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor() { }

  admin: any = {};

  client: any = {};

  car: any = {};

  clientReceipt: any = {};

  clients = [];

  cars = [];

  clientReceipts = [];
}
