import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-receipts-by-client',
  templateUrl: './view-receipts-by-client.component.html',
  styleUrls: ['./view-receipts-by-client.component.css']
})
export class ViewReceiptsByClientComponent implements OnInit {

  public clientReceipts: ClientReceipt[];
  public clientReceipt = new ClientReceipt();
  public client = new Client();
  public car = new Car();

  listFilter: string = "";

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit():void {
    this.title.setTitle("Receipts By Client");
  }

  public getReceiptsByClient(id: number): void {
    this.adminService.getReceiptsByClient(id).subscribe((clientReceipts) => {
      console.log(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      console.log(`Failed on get all Client Receipts! `+ `\n` +err.message);
      alert(`Error on view all Client Receipts! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Receipts by this Client` + `\n` + 
      `4. Wrong Client ID: ${this.client.id}`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

}
