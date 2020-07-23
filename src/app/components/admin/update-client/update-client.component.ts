import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {

  public client = new Client();

  public constructor(private title: Title, private adminService: AdminService, private router: Router) { }

  public ngOnInit():void {
    this.title.setTitle("Update Client");
  }

  public getClient():void {
    this.adminService.getClient(this.client.id).subscribe(client => {
      console.log(`Success! `,
        this.client.id = client.id, 
        this.client.name = client.name,
        this.client.birthday = client.birthday,
        this.client.phoneNumber = client.phoneNumber,
        this.client.email = client.email, 
        this.client.password = client.password, 
        this.client.balance = client.balance);
      this.router.navigate(["/admin/update-client/client-id/"+this.client.id]);
    }, err => {
      console.log(`Failed on get Client ID: `,this.client.id + `\n` +err.message);
      alert(`Error on view Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
  }

  public updateClient(): void {
    this.adminService.updateClient(this.client).subscribe(client => {
      console.log(`Success on update Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully updated!`);
      this.router.navigate(["/admin/view-all-clients"])
    }, err => {
      console.log(`Failed on update Client! `,this.client.name + `\n` +err.message);
      alert(`Error on update Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
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
