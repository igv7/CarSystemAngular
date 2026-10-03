import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  /** Form model; the inputs bind to it. */
  public client = new Client();

  /** Today's date (yyyy-MM-dd), the latest allowed birthday. */
  public today = new Date().toISOString().slice(0, 10);

  private log = this.logger.for('AddClientComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Add client");
  }

  /** Adds the client and opens the client list. The template only calls this once the form is valid. */
  public addClient(): void {
    this.adminService.addClient(this.client).subscribe(client => {
      this.log.info(`Success on add Client! `,this.client = client);
      this.router.navigate(["/admin/view-all-clients"])
    }, err => {
      this.log.error(`Failed on add Client! `, this.client.name, err);
      const message = serverErrorMessage(err);
      alert(message ? `Error on add Client!` + `\n\n` + message : `Error on add Client! ` + `\n` + `The reasons: ` + `\n` +
      `1. No internet connection` + `\n` +
      `2. No connection to the server` + `\n` +
      `3. This Client name: ${this.client.name} already exists in the system!`);
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
