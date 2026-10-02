import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-view-all-clients',
  templateUrl: './view-all-clients.component.html',
  styleUrls: ['./view-all-clients.component.css']
})
export class ViewAllClientsComponent implements OnInit {

  /** Clients shown in the table; undefined (loading picture shown) until the server responds. */
  public clients: Client[];

  /** Text typed into the filter box; the table is filtered by it through a pipe. */
  listFilter: string = "";

  private log = this.logger.for('ViewAllClientsComponent');

  public constructor(private title: Title, private adminService: AdminService, private router: Router, private logger: LoggerService) { }

  /** Loads all clients into the table. */
  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe((clients) => {
      this.log.debug(`Success! `,this.clients = clients);
      setTimeout(() => this.clients = clients, 1000);
    }, err => {
      this.log.error(`Failed on get all Clients! `, err);
      alert(`Error on view all Clients! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. No Clients`);
    });
    this.title.setTitle("All Clients");
  }

  /** Returns to /admin. */
  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
    this.title.setTitle("Admin Page");
  }

}
