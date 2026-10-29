import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { SignupService } from 'src/app/services/signup.service';
import { LoggerService } from 'src/app/services/logger.service';
import { serverErrorMessage } from 'src/app/validation/sanitize';
import { AppRoutes } from 'src/app/constants/app-routes';
import { PageTitles } from 'src/app/constants/page-titles';
import { ClientType } from 'src/app/models/client-type';
import { ValidationRules } from 'src/app/validation/rules';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  /** Field rules (patterns, lengths, ranges) used by the template. */
  public readonly rules = ValidationRules;

  /** The type values; the Type field always shows CLIENT. */
  public readonly clientType = ClientType;

  /** Form model; the inputs bind to it. */
  public client = new Client();

  /** Today's date (yyyy-MM-dd), the latest allowed birthday. */
  public today = new Date().toISOString().slice(0, 10);

  private log = this.logger.for('SignupComponent');

  public constructor(private signupService: SignupService,private title: Title, private router: Router, private logger: LoggerService) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle(PageTitles.SIGN_UP);
  }

  /** Creates the client account and opens the sign-in page; alerts if the name is already taken. */
  onSubmit() {
    this.signupService.signUp(this.client).subscribe(client => {
      this.log.info(`Success on sign up Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully added! ` + 
      "\nId: " + client.id +
      "\nName: " + client.name +
      "\nDOB: " + client.birthday +
      "\nPhone Number: " + client.phoneNumber +
      "\nEmail: " + client.email +
      "\nBalance: " + client.balance);
      this.router.navigate([AppRoutes.LOGIN])
    }, err => {
      this.log.error(`Failed on sign up Client! `, this.client.name, err);
      const message = serverErrorMessage(err);
      alert(message ? `Error on sign up!` + `\n\n` + message : `Error on sign up Client! This Client name: ${this.client.name}` +` `+
      `already exists in the system!` +` `+ `\n`+err.message);
    });
  }

  /** Cancel button: leaves the form and returns to /home. */
  public cancel() {
    this.router.navigate([AppRoutes.HOME])
  }

  /** Close (×) button: leaves the form and returns to /home. */
  public close() {
    this.router.navigate([AppRoutes.HOME])
  }

}
