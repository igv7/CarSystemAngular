import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-delete-client',
  templateUrl: './delete-client.component.html',
  styleUrls: ['./delete-client.component.css']
})
export class DeleteClientComponent implements OnInit {

  /** Form model for the id lookup; filled with the loaded client. */
  public client = new Client();

  private log = this.logger.for('DeleteClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
   this.title.setTitle("Delete Client");
  }

  /**
   * Loads the client with the entered id and shows its details below, so it can be checked before deleting.
   */
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
      this.router.navigate(["/admin/delete-client/client-id/"+this.client.id]);
    }, err => {
      this.log.error(`Failed on get Client ID: `, this.client.id, err);
      alert(`Error on view Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
  }

  /** After confirmation, deletes the client and opens the client list. */
  public deleteClient(): void {
    if(confirm(`Are You sure You want to remove this Client? ` + `\n` + `Client ID: ${this.client.id}`)) {
    this.adminService.deleteClient(this.client.id).subscribe((c) => {
      this.log.info(`Success on delete Client Id: `,this.client.id = c.id);
        alert(`Client Id: ${c.id} Name: `+c.name+ ` has been succesfully deleted!`);
        this.router.navigate(["/admin/view-all-clients"]);
    }, err => {
      this.log.error(`Failed on delete Client Id: `, this.client.id, err);
      alert(`Error on delele Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
   }
  }


  /** Close (×) button: leaves the form and returns to /admin. */
  public close(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

  /** Cancel button: leaves the form and returns to /admin. */
  public cancel(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

}
