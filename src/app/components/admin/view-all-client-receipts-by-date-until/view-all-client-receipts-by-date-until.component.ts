// import { Component, OnInit } from '@angular/core';
// import { ClientReceipt } from 'src/app/models/clientReceipt';
// import { Client } from 'src/app/models/client';
// import { AdminService } from 'src/app/services/admin.service';
// import { Router } from '@angular/router';
// import { Car } from 'src/app/models/car';

// @Component({
//   selector: 'app-view-all-client-receipts-by-date-until',
//   templateUrl: './view-all-client-receipts-by-date-until.component.html',
//   styleUrls: ['./view-all-client-receipts-by-date-until.component.css']
// })
// export class ViewAllClientReceiptsByDateUntilComponent implements OnInit {

//   public clientReceipts: ClientReceipt[];
//   public clientReceipt = new ClientReceipt();
//   public client = new Client();
//   public car = new Car();

//   showImage: boolean = false;

//   public constructor(private adminService: AdminService, private router: Router) { }

//   public ngOnInit(): void {
    
//   }

//   public getAllClientReceiptsByDate(id: number, receiptDate: string): void {
//     this.adminService.getAllClientReceiptsByDate(id, receiptDate).subscribe((clientReceipts) => {
//       console.log(`Success! `,this.clientReceipts = clientReceipts);
//       setTimeout(() => this.clientReceipts = clientReceipts, 1000);
//     }, err => {
//       console.log(`Failed on get all Client Receipts By Date! `+ `\n` +err.message);
//       alert(`Error on get all Client Receipts By Date! ` + `\n` +err.message);
//     });
//   }

//   public backToAdmin(): void {
//     this.router.navigate(["/admin"]);
//   }

//   public toggleImage() {
//     this.showImage = !this.showImage;
//   }


// }
