import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-client',
  templateUrl: './delete-client.component.html',
  styleUrls: ['./delete-client.component.css']
})
export class DeleteClientComponent implements OnInit {

  public client = new Client();

  public constructor(private adminService: AdminService, private router: Router) { }

  public ngOnInit(): void {
   
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
      this.router.navigate(["/admin/delete-client/client-id/"+this.client.id]);
    }, err => {
      console.log(`Failed on get Client ID: `,this.client.id + `\n` +err.message);
      alert(`Error on view Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
  }

  public deleteClient(): void {
    if(confirm(`Are You sure You want to remove this Client? ` + `\n` + `Client ID: ${this.client.id}`)) {
    this.adminService.deleteClient(this.client.id).subscribe((c) => {
      console.log(`Success on delele Client Id: `,this.client.id = c.id);
        alert(`Client Id: ${c.id} Name: `+c.name+ ` has been succesfully deleted!`);
        this.router.navigate(["/admin/view-all-clients"]);
    }, err => {
      console.log(`Failed on delele Client Id: `,this.client.id + `\n` +err.message);
      alert(`Error on delele Client! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server` + `\n` + 
      `3. Wrong ID: ${this.client.id}`);
    });
   }
  }


  public close(): void {
    this.router.navigate(["/admin"]);
  }

  public cancel(): void {
    this.router.navigate(["/admin"]);
  }

}
