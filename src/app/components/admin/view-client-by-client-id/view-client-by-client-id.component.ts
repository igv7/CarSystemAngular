import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

/** Admin lookup of one client by ClientID (the 9-digit personal identity number), not by the database id. */
@Component({
  selector: 'app-view-client-by-client-id',
  templateUrl: './view-client-by-client-id.component.html',
  styleUrls: ['./view-client-by-client-id.component.css']
})
export class ViewClientByClientIdComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the ClientID lookup; filled with the loaded client. */
  public client = new Client();

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewClientByClientIdComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.VIEW_CLIENT_BY_CLIENT_ID);
  }

  /** Loads the client with the entered ClientID and shows its details below. */
  public getClient():void {
    const clientID = this.client.clientID;
    this.adminService.getClientByClientID(clientID).subscribe(client => {
      this.log.debug(`Success! `, this.client = client);
      this.message = null;
      this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT_BY_CLIENT_ID, RoutePaths.CLIENT_ID, this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client by identity number: `, clientID, err);
      this.message = loadErrorMessage(err, Messages.wrongClientClientId(clientID));
      // Close the details of a client looked up before.
      this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT_BY_CLIENT_ID]);
    });
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel() {
    this.router.navigate([AppRoutes.ADMIN])
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Close (×) button: leaves the form and returns to /admin. */
  public close() {
    this.router.navigate([AppRoutes.ADMIN])
    this.title.setTitle(PageTitles.ADMIN);
  }

  /** Reset button: clears the form, the client shown below the form and the message, and closes details opened from here. */
  public reset(): void {
    this.client = new Client();
    this.message = null;
    this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT_BY_CLIENT_ID]);
  }

}
