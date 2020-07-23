import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  public client: Client;

  public constructor(private title: Title, private activatedRoute: ActivatedRoute, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.adminService.getAllClients().subscribe((clients) => {
      const id = +this.activatedRoute.snapshot.params.id;
      this.client = clients.find(c => c.id == id);
      console.log(`Success on get Client details! `);
    }, err => {
      console.log(`Failed on get Client details! ` + `\n` +err.message);
      alert(`Error on view Client details! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("Client Details");
  }

  public backToAllClients(): void {
    this.router.navigate(["/admin/view-all-clients"]);
    this.title.setTitle("All Clients");
  }

}
