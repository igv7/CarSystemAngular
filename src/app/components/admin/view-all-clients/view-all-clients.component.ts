import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-clients',
  templateUrl: './view-all-clients.component.html',
  styleUrls: ['./view-all-clients.component.css']
})
export class ViewAllClientsComponent implements OnInit {

  public clients: Client[];

  listFilter: string = "";

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe((clients) => {
      console.log(`Success! `,this.clients = clients);
      setTimeout(() => this.clients = clients, 1000);
    }, err => {
      console.log(`Failed on get all Clients! `+ `\n` +err.message);
      alert(`Error on view all Clients! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
  }

  public backToAdmin(): void {
    this.router.navigate(["/admin"]);
  }

}
