// import { Component, OnInit } from '@angular/core';
// import { ClientReceipt } from 'src/app/models/clientReceipt';
// import { Client } from 'src/app/models/client';
// import { Car } from 'src/app/models/car';
// import { Router } from '@angular/router';
// import { ClientService } from 'src/app/services/client.service';

// @Component({
//   selector: 'app-view-all-receipts-by-date-until',
//   templateUrl: './view-all-receipts-by-date-until.component.html',
//   styleUrls: ['./view-all-receipts-by-date-until.component.css']
// })
// export class ViewAllReceiptsByDateUntilComponent implements OnInit {

//   public clientReceipts: ClientReceipt[];
//   public clientReceipt = new ClientReceipt();
//   public client = new Client();
//   public car = new Car();

//   showImage: boolean = false;

//   public constructor(private clientService: ClientService, private router: Router) { }

//   public ngOnInit(): void {
    
//   }

//   public getAllReceiptsByDate(receiptDate: string): void {
//     this.clientService.getAllReceiptsByDate(receiptDate).subscribe((clientReceipts) => {
//       console.log(`Success! `,this.clientReceipts = clientReceipts);
//       setTimeout(() => this.clientReceipts = clientReceipts, 1000);
//     }, err => {
//       console.log(`Failed on get all Receipts By Date! `+ `\n` +err.message);
//       alert(`Error on get all Receipts By Date! ` + `\n` +err.message);
//     });
//   }

//   public backToMainPage(): void {
//     this.router.navigate(["/client"]);
//   }

//   public toggleImage() {
//     this.showImage = !this.showImage;
//   }

// }
