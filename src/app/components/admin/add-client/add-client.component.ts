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

  public constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    
  }

  public addClient(): void {
    this.adminService.addClient(this.client).subscribe(client => {
      console.log(`Success on add Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully added! ` + 
      "\nId: " + client.id +
      "\nName: " + client.name +
      "\nDOB: " + client.birthday +
      "\nPassword: " + client.password +
      "\nPhone Number: " + client.phoneNumber +
      "\nEmail: " + client.email +
      "\nBalance: " + client.balance);
      this.router.navigate(["/admin/view-all-clients"])
    }, err => {
      console.log(`Failed on add Client! `,this.client.name + `\n` +err.message);
      alert(`Error on add Client! This Client name: ${this.client.name}` +` `+ 
      `already exists in the system!` +` `+ `\n`+err.message);
    });
  }



  public cancel() {
    this.router.navigate(["/admin"])
  }

  public close() {
    this.router.navigate(["/admin"])
  }

}
