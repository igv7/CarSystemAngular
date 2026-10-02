import { Component, OnInit } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/services/exit-client-guard.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

/** Client menu at `/client`; each page opens as a child route below the menu. */
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, ComponentCanDeactivate {

  /** Set by save(); while false and nobody is signed in, leaving the page asks for confirmation. */
  saved: boolean = false;
  /**
   * Marks the page as saved so leaving it no longer asks for confirmation (not called anywhere at the
   * moment).
   */
  save() {
    this.saved = true;
  }
  /**
   * Called by ExitClientGuardService when leaving `/client`: asks for confirmation unless the page was saved
   * or someone is signed in.
   */
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved && this.loginService.isLoggedIn == false) {
      return confirm("Are You sure You want to exit?");
    }
    else {
      return true;
    }
  }

  public constructor(private title: Title, private loginService: LoginService, private router: Router) { }

  /** Sets the browser tab title. */
  public ngOnInit(): void {
    this.title.setTitle("Client Page");
  }

  /** Sign Out button: asks for confirmation, then signs out and goes to /home. */
  public logout() {
    this.loginService.confirmAndSignOut();
  }

  /** Opens the list of cars available to rent. */
  public viewCars() {
    this.router.navigate(["/client/view-cars"])
  }

  /** Opens the list of the client's rented cars. */
  public viewMyCars() {
    this.router.navigate(["/client/view-my-cars"])
  }

  /** Opens the client's receipts. */
  public viewMyReceipts() {
    this.router.navigate(["/client/view-my-receipts"])
  }

  /** Opens the client's balance. */
  public viewMyBalance() {
    this.router.navigate(["/client/view-my-balance"])
  }

  /** Opens the Delete Account page. */
  public deleteAccount() {
    this.router.navigate(["/client/delete-account"])
  }

}
