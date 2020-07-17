import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-view-my-balance',
  templateUrl: './view-my-balance.component.html',
  styleUrls: ['./view-my-balance.component.css']
})
export class ViewMyBalanceComponent implements OnInit {

  public client = new Client();

  public constructor(private clientService: ClientService, private router: Router) { }

  public ngOnInit(): void {
    this.clientService.getBalance().subscribe((client) => {
      console.log(`Success! `,this.client = client);
      setTimeout(() => this.client = client, 1000);
    }, err => {
      console.log(`Failed on get My Balance! `+ `\n` +err.message);
      // alert(`Error on get My Balance! ` + `\n` +err.message);
    });
  }


  public backToMainPage(): void {
    this.router.navigate(["/client"]);
  }


}
