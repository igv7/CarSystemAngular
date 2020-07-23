import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-my-balance',
  templateUrl: './view-my-balance.component.html',
  styleUrls: ['./view-my-balance.component.css']
})
export class ViewMyBalanceComponent implements OnInit {

  public client = new Client();

  public constructor(private title: Title, private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getBalance().subscribe((client) => {
      console.log(`Success! `,this.client = client);
      setTimeout(() => this.client = client, 1000);
    }, err => {
      console.log(`Failed on get My Balance! `+ `\n` +err.message);
      alert(`Error on get My Balance! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
    this.title.setTitle("My Balance");
  }


  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }


}
