import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-client-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, ComponentCanDeactivate {

  saved: boolean = false;
  save() {
    this.saved = true;
  }
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved && this.loginService.isLoggedIn == false) {
      return confirm("Are You sure You want to exit?");
    }
    else {
      return true;
    }
  }

  public constructor(private title: Title, private loginService: LoginService, private router: Router) { }

  public ngOnInit(): void {
    this.title.setTitle("Client Page");
  }

  public logout() {
    // this.loginService.logout();
    this.loginService.setClientUserF();
    this.router.navigate(["/home"]);
  }

  public viewCars() {
    this.router.navigate(["/client/view-cars"])
  }

  public viewMyCars() {
    this.router.navigate(["/client/view-my-cars"])
  }

  public viewMyReceipts() {
    this.router.navigate(["/client/view-my-receipts"])
  }

  public viewMyBalance() {
    this.router.navigate(["/client/view-my-balance"])
  }

  public deleteAccount() {
    this.router.navigate(["/client/delete-account"])
  }

}
