import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-view-all-receipts',
  templateUrl: './view-all-receipts.component.html',
  styleUrls: ['./view-all-receipts.component.css']
})
export class ViewAllReceiptsComponent implements OnInit {

  public clientReceipts: ClientReceipt[];
  public client = new Client();

  listFilter: string = "";

  // showImage: boolean = false;

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
      console.log(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      console.log(`Failed on get all Receipts! `+ `\n` +err.message);
      alert(`Error on get all Receipts! ` + `\n` +err.message);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

  // public toggleImage() {
  //   this.showImage = !this.showImage;
  // }

}
