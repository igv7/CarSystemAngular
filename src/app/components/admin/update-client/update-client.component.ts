import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {

  /** Form model: the id is typed in first, then the loaded client fills the rest for editing. */
  public client = new Client();

  /** Today's date (yyyy-MM-dd), the latest allowed birthday. */
  public today = new Date().toISOString().slice(0, 10);

  private log = this.logger.for('UpdateClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit():void {
    this.title.setTitle("Update Client");
  }

  /** Loads the client with the entered id into the form and shows its details below. */
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
      this.router.navigate(["/admin/update-client/client-id/"+this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client ID: `, this.client.id, err);
      alert(`Error on view Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
  }

  /** Saves the edited client and opens the client list. */
  public updateClient(): void {
    this.adminService.updateClient(this.client).subscribe(client => {
      this.log.info(`Success on update Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully updated!`);
      this.router.navigate(["/admin/view-all-clients"])
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
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

  /** Close (×) button: leaves the form and returns to /admin. */
  public close() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

}
