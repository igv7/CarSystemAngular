import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-my-receipts',
  templateUrl: './view-my-receipts.component.html',
  styleUrls: ['./view-my-receipts.component.css']
})
export class ViewMyReceiptsComponent implements OnInit {

  public clientReceipts: ClientReceipt[];
  public client: Client;

  listFilter: string = "";

  // showImage: boolean = false;

  public constructor(private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      console.log(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      console.log(`Failed on get my Receipts! `+ `\n` +err.message);
      alert(`Error on get my Receipts! ` + `\n` +err.message);
    });
  }

  public backToMainPage(): void {
    this.router.navigate(["/client"]);
  }

  // public toggleImage() {
  //   this.showImage = !this.showImage;
  // }

}
