import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

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

  // showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    
  }

  public getReceiptsByClient(id: number): void {
    this.adminService.getReceiptsByClient(id).subscribe((clientReceipts) => {
      console.log(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      console.log(`Failed on get all Client Receipts! `+ `\n` +err.message);
      alert(`Error on get all Client Receipts! ` + `\n` +err.message);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  // public toggleImage() {
  //   this.showImage = !this.showImage;
  // }

}
