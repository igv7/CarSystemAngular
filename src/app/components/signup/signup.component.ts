import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { SignupService } from 'src/app/services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public client = new Client();

  public constructor(private signupService: SignupService,private title: Title, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("Sign Up");
  }

  onSubmit() {
    this.signupService.signUp(this.client).subscribe(client => {
      console.log(`Success on sign up Client! `,this.client = client);
      alert(`Client Name: ${this.client.name} has been succesfully added! ` + 
      "\nId: " + client.id +
      "\nName: " + client.name +
      "\nDOB: " + client.birthday +
      "\nPassword: " + client.password +
      "\nPhone Number: " + client.phoneNumber +
      "\nEmail: " + client.email +
      "\nBalance: " + client.balance);
      this.router.navigate(["/login"])
    }, err => {
      console.log(`Failed on sign up Client! `,this.client.name + `\n` +err.message);
      alert(`Error on sign up Client! This Client name: ${this.client.name}` +` `+ 
      `already exists in the system!` +` `+ `\n`+err.message);
    });
  }

  public cancel() {
    this.router.navigate(["/home"])
  }

  public close() {
    this.router.navigate(["/home"])
  }

}
