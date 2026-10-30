import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-view-all-receipts',
  templateUrl: './view-all-receipts.component.html',
  styleUrls: ['./view-all-receipts.component.css']
})
export class ViewAllReceiptsComponent implements OnInit {

  /** Route links used by the template. */
  public readonly routes = AppRoutes;
  /** Route segments used by the template's detail links. */
  public readonly paths = RoutePaths;

  /** Receipts shown in the table; undefined (loading picture shown) until the server responds. */
  public clientReceipts: ClientReceipt[];
  public client = new Client();

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewAllReceiptsComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all receipts into the table. */
  public ngOnInit(): void {
    this.adminService.getAllReceipts().subscribe((clientReceipts) => {
      this.log.debug(`Success! `,this.clientReceipts = clientReceipts);
      this.message = clientReceipts.length ? null : Messages.NO_RECEIPTS;
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      this.log.error(`Failed on get all Receipts! `, err);
      this.clientReceipts = null;
      this.message = loadErrorMessage(err);
    });
    this.title.setTitle(PageTitles.ALL_RECEIPTS);
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

}
