import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  public client = new Client();

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("Add client");
  }

  public addClient(): void {
    if (!this.client.name || !this.client.birthday || !this.client.password || !this.client.phoneNumber || !this.client.email) {
      this.router.navigate(["/admin/add-client"])
      this.adminService.addClient(this.client).subscribe(client => {}, err => {
        console.log(`Failed on add Client! `,this.client.name + `\n` +err.message);
        alert(`Error on add Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
      })
    } else {
    this.adminService.addClient(this.client).subscribe(client => {
      console.log(`Success on add Client! `,this.client = client);
      this.router.navigate(["/admin/view-all-clients"])
    }, err => {
      console.log(`Failed on add Client! `,this.client.name + `\n` +err.message);
      alert(`Error on add Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. This Client name: ${this.client.name} already exists in the system!`);
    });
   }
  }



  public cancel() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

  public close() {
    this.router.navigate(["/admin"])
    this.title.setTitle("Admin Page");
  }

}
