import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  public client = new Client();

  public constructor(private clientService: ClientService, private router: Router, private loginService: LoginService) { }

  public ngOnInit(): void {
    
  }

  public deleteAccount() {
    this.clientService.deleteAccount().subscribe((client) => {
      console.log(`Success on delete Account `,this.client = client);
      this.loginService.setClientUserF();
      this.router.navigate(["/home"]);
    }, err => {
      console.log(`Failed on delete Account! `+ `\n` +err.message);
      // alert(`Error on delete Account! ` + `\n` +err.message);
    });
  }


  public backToMainPage(): void {
    this.router.navigate(["/client"]);
  }

}
