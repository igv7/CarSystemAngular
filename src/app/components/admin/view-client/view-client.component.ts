import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  /** Form model for the id lookup; filled with the loaded client. */
  public client = new Client();

  private log = this.logger.for('ViewClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle("View Client");
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
      this.router.navigate(["/admin/view-client/client-id/"+this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client ID: `, this.client.id, err);
      alert(`Error on view Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

  /** Close (×) button: leaves the form and returns to /admin. */
  public close() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

}
