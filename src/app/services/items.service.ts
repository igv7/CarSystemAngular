import { Injectable } from '@angular/core';

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
