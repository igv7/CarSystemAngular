import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-my-receipts',
  templateUrl: './view-my-receipts.component.html',
  styleUrls: ['./view-my-receipts.component.css']
})
export class ViewMyReceiptsComponent implements OnInit {

  /** Receipts shown in the table; undefined (loading picture shown) until the server responds. */
  public clientReceipts: ClientReceipt[];
  /** The client picked by the id in the URL. */
  public client: Client;

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  private log = this.logger.for('ViewMyReceiptsComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's receipts into the table. */
  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      this.log.debug(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      this.log.error(`Failed on get my Receipts! `, err);
      alert(`Error on view My Receipts! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Receipts`);
    });
    this.title.setTitle("My Receipts");
  }

  /** Returns to /client. */
  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

}
