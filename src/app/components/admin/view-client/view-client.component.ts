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

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** Form model for the id lookup; filled with the loaded client. */
  public client = new Client();

  /** Shown in the message box in place of the table: an error or a "nothing found" text; null when all is well. */
  public message: string;

  private log = this.logger.for('ViewClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle(PageTitles.VIEW_CLIENT);
  }

  /** Loads the client with the entered id and shows its details below. */
  public getClient():void {
    this.adminService.getClient(this.client.id).subscribe(client => {
      this.log.debug(`Success! `,
        this.client.id = client.id, 
        this.client.name = client.name,
        this.client.birthday = client.birthday,
        this.client.phoneNumber = client.phoneNumber,
        this.client.email = client.email, 
        this.client.password = client.password, 
        this.client.balance = client.balance);
      this.message = null;
      this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT, RoutePaths.CLIENT_ID, this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client ID: `, this.client.id, err);
      this.message = loadErrorMessage(err, Messages.wrongClientId(this.client.id));
      // Close the details of a car or client looked up before.
      this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT]);
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
    this.router.navigate([AppRoutes.ADMIN_VIEW_CLIENT]);
  }

}
