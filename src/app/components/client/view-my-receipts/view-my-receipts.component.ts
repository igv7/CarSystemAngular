import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-my-receipts',
  templateUrl: './view-my-receipts.component.html',
  styleUrls: ['./view-my-receipts.component.css']
})
export class ViewMyReceiptsComponent implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;
  /** Route segments used by the template's detail links. */
  public readonly paths = RoutePaths;

  /** Receipts shown in the table; undefined (loading picture shown) until the server responds. */
  public clientReceipts: ClientReceipt[];
  /** The client picked by the id in the URL. */
  public client: Client;

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewMyReceiptsComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private logger: LoggerService) { }

  /** Loads the client's receipts into the table. */
  public ngOnInit(): void {
    this.clientService.getMyReceipts().subscribe((clientReceipts) => {
      this.log.debug(`Success! `,this.clientReceipts = clientReceipts);
      this.message = clientReceipts.length ? null : Messages.NO_MY_RECEIPTS;
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      this.log.error(`Failed on get my Receipts! `, err);
      this.clientReceipts = null;
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.MY_RECEIPTS);
  }

  /** Returns to /client. */
  public backToMainPage(): void {
    this.router.navigate([AppRoutes.CLIENT]);
    this.title.setTitle(PageTitles.CLIENT);
  }

}
