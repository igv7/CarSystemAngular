import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {

  public client = new Client();

  public constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    
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
      alert(`Error on get Client! Wrong ID: ${this.client.id}` +` `+ `\n`+err.message);
    });
  }

  public updateClient(): void {
    this.adminService.updateClient(this.client).subscribe(client => {
      console.log(`Success on update Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully updated! ` + 
      "\nId: " + client.id +
      "\nName: " + client.name +
      "\nDOB: " + client.birthday +
      "\nPassword: " + client.password +
      "\nPhone Number: " + client.phoneNumber +
      "\nEmail: " + client.email +
      "\nBalance: " + client.balance);
      this.router.navigate(["/admin/view-all-clients"])
    }, err => {
      console.log(`Failed on update Client! `,this.client.name + `\n` +err.message);
      alert(`Error on update Client! Wrong ID: ${this.client.id}` +` `+ `\n`+err.message);
    });
  }



  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}