import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Title } from '@angular/platform-browser';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  public client = new Client();

  private log = this.logger.for('DeleteAccountComponent');

  public constructor(private title: Title, private clientService: ClientService, private router: Router, private loginService: LoginService, private logger: LoggerService) { }

  public ngOnInit(): void {
    this.title.setTitle("Delete Account");
   }

  /** After confirmation, deletes the client's account, goes to /home and signs out. */
  public deleteAccount() {
    if(confirm(`Are You sure You want to Delete Your Account?`)) {
    this.clientService.deleteAccount().subscribe((client) => {
      this.log.info(`Success on delete Account `,this.client = client);
      // Sign out after leaving /client, so its canDeactivate() doesn't ask "exit?" as well.
      this.router.navigate(["/home"]).then(left => {
        if (left) {
          this.loginService.logout();
        }
      });
    }, err => {
      this.log.error(`Failed on delete Account! `, err);
      alert(`Error on delele Account! ` + `\n` + `The reasons: ` + `\n` + 
      `1. No internet connection` + `\n` + 
      `2. No connection to the server`);
    });
   }
  }


  /** Returns to /client. */
  public backToMainPage(): void {
    this.router.navigate(["/client"]);
    this.title.setTitle("Client Page");
  }

}
