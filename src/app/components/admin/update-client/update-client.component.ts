import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';
import { AppRoutes, RoutePaths } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ValidationRules } from 'src/app/validation/rules';
import { Messages, loadErrorMessage } from 'src/app/constants/messages';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model: the id is typed in first, then the loaded client fills the rest for editing. */
  public client = new Client();

  /** Today's date (yyyy-MM-dd), the latest allowed birthday. */
  public today = new Date().toISOString().slice(0, 10);

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('UpdateClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.UPDATE_CLIENT);
  }

  /** Loads the client with the entered id into the form and shows its details below. */
  public getClient():void {
    this.adminService.getClient(this.client.id).subscribe(client => {
      this.log.debug(`Success! `,
        this.client.id = client.id, 
        this.client.name = client.name,
        this.client.clientID = client.clientID,
        this.client.birthday = client.birthday,
        this.client.phoneNumber = client.phoneNumber,
        this.client.email = client.email, 
        this.client.password = client.password, 
        this.client.balance = client.balance);
      this.message = null;
      this.router.navigate([AppRoutes.ADMIN_UPDATE_CLIENT, RoutePaths.CLIENT_ID, this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client ID: `, this.client.id, err);
      this.message = loadErrorMessage(err, Messages.wrongClientId(this.client.id));
      // Close the details of a car or client looked up before.
      this.router.navigate([AppRoutes.ADMIN_UPDATE_CLIENT]);
    });
  }

  /** Saves the edited client and opens the client list. */
  public updateClient(): void {
    this.adminService.updateClient(this.client).subscribe(client => {
      this.log.info(`Success on update Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully updated!`);
      this.router.navigate([AppRoutes.ADMIN_VIEW_ALL_CLIENTS])
    }, err => {
      this.log.error(`Failed on update Client! `, this.client.name, err);
      const message = serverErrorMessage(err);
      alert(message ? `Error on update Client!` + `\n\n` + message : `Error on update Client! ` + `\n` + `The reasons: ` + `\n` +
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
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
    this.router.navigate([AppRoutes.ADMIN_UPDATE_CLIENT]);
  }

}
