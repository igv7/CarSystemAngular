import { Component, OnInit } from '@angular/core';
import { ClientReceipt } from 'src/app/models/clientReceipt';
import { Client } from 'src/app/models/client';
import { Car } from 'src/app/models/car';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';

@Component({
  selector: 'app-view-receipts-by-client',
  templateUrl: './view-receipts-by-client.component.html',
  styleUrls: ['./view-receipts-by-client.component.css']
})
export class ViewReceiptsByClientComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Route links used by the template. */
  public readonly routes = AppRoutes;
  /** Route segments used by the template's detail links. */
  public readonly paths = RoutePaths;

  /** Receipts shown in the table; undefined (loading picture shown) until the server responds. */
  public clientReceipts: ClientReceipt[];
  public clientReceipt = new ClientReceipt();
  /** Form model; `id` holds the client to look up. */
  public client = new Client();
  public car = new Car();

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  private log = this.logger.for('ViewReceiptsByClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.RECEIPTS_BY_CLIENT);
  }

  /** Loads the given client's receipts into the table. */
  public getReceiptsByClient(id: number): void {
    this.adminService.getReceiptsByClient(id).subscribe((clientReceipts) => {
      this.log.debug(`Success! `,this.clientReceipts = clientReceipts);
      setTimeout(() => this.clientReceipts = clientReceipts, 1000);
    }, err => {
      this.log.error(`Failed on get all Client Receipts! `, err);
      alert(`Error on view all Client Receipts! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Receipts by this Client` + `\n` + 
      `4. Wrong Client ID: ${this.client.id}`);
    });
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate([AppRoutes.ADMIN]);
    this.title.setTitle(PageTitles.ADMIN);
  }

}
