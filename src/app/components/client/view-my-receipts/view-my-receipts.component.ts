import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-my-receipts',
  templateUrl: './view-my-receipts.component.html',
  styleUrls: ['./view-my-receipts.component.css']
})
export class ViewMyReceiptsComponent implements OnInit {

  public clientReceipts: ClientReceipt[];
  public client: Client;

  listFilter: string = "";

  public constructor(private title: Title, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      console.log(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      console.log(`Failed on get my Receipts! `+ `\n` +err.message);
      alert(`Error on view My Receipts! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Receipts`);
    });
    this.title.setTitle("My Receipts");
  }

  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

}
